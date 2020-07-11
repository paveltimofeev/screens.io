const backstop = require('backstopjs');

const storage = new (require('../storage/storage-adapter'));
const appUtils = require('./app-utils');
const { EngineAdapter, JsonReportAdapter } = require('./engine-adapter');
const { FilePathsService } = require('./app-utils');
const { BucketAdapter } = require('./bucket-adapter');
const imageProcessor = require('./image-processor');

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const exists = promisify(fs.exists);
const copyFile = promisify(fs.copyFile);
const writeFile = promisify(fs.writeFile);

const mkdir = promisify(fs.mkdir);

const engine = new EngineAdapter();
const bucketAdapter = new BucketAdapter('vrtdata');
const filePathsService = new FilePathsService();

const config = require('../config.json');
console.log('[QueueProcessor] Loading module', './media_storage_strategies/' + config.mediaStorageStrategy)
const mediaStorageStrategy = require('./media_storage_strategies/' + config.mediaStorageStrategy);

class QueueProcessor {

  constructor (ctx, dbName) {
    
    this._db = dbName;
    this._ctx = ctx;
    this._flow = mediaStorageStrategy.createFlow();

    console.log('[TaskProcessor] ctor. dbName:', dbName)
  }

  static create (ctx) {

    const validateParams = (name) => {

      if (!ctx[name]) {

        console.error(`No ${name} in request context`, ctx)
        var err = new Error('Bad request. Not valid context.')
        err.status = 400
        throw err;
      }
    }

    validateParams('user');
    validateParams('tenant');
    validateParams('userid');
    validateParams('user');

    return new QueueProcessor(ctx, ctx.userid);
  }


  async updateScenariosRunStatus (scenarios) {

    await scenarios
      .filter(appUtils.uniqueOnly)
      .filter(appUtils.skipPassedIfHasFailed)
      .forEach(async scenario => {

        console.log('[VRT] updateScenariosRunStatus', scenario.label, scenario.status)

        await storage.updateScenarioByLabel(
          this._db,
          scenario.label,
          { meta_recentRunStatus: scenario.status }
        )

      })
  }

  async processRun (runId, config) {

    console.log('[QueueProcessor] processRun. runId:', runId)

    const record = await storage.createHistoryRecord(this._db, {
      state: 'Running',
      startedAt: new Date(),
      startedBy: this._ctx.user,
      viewports: config.viewports.map( x => x.label),
      scenarios: config.scenarios.map( x => {
        return {
          id: x._id.toString(),
          label: x.label
        }
      }),
      runId
    })

    try {

      await this._flow.RunPreProcess( config );
    
      // [download ref images of every scenario in config and place them to corresponding directory] [with retries]
      // for ( let i = 0; i < config.scenarios.length; i++ ) {

      //   if (config.scenarios[i].meta_referenceImageUrl) {
      //     await bucketAdapter.download(
      //       path.join(
      //         filePathsService.vrtDataFullPath(),
      //         config.scenarios[ i ].meta_referenceImageUrl
      //       )
      //     );
      //   }
      // }

      // await writeFile('./backstop-config.debug.json', JSON.stringify(config), 'utf-8')
      let result = await backstop('test', { config: config } )

      console.log('[QueueProcessor] RUN RESULT', result);

      try {
        console.log( '[QueueProcessor] `backstop test` command completed' )

        const report = await engine.getReport( config.paths.json_report )

        const data = await this.postProcessReport( runId, report, config.paths.json_report )
        await storage.createReport( this._db, data )

        record.state = 'Passed';
        record.finishedAt = new Date();
        record.scenarios = record.scenarios.map( s => {

          let test = report.tests.find( t => t.pair.label === s.label )
          if( test ) {
            s.status = test.status;
          } else {
            console.warn( '[QueueProcessor] Cannot find test result for "' + s.label + '" in', report )
          }
          return s;
        } );

        await this.updateScenariosRunStatus( record.scenarios )
        await storage.updateHistoryRecord( this._db, record._id, storage.convertToObject( record ) )
      }
      catch (err) {
        console.error('[QueueProcessor] Success report processing failed', err)
        throw err;
      }

      return runId
    }
    catch (err) {

      console.error('[QueueProcessor] Error:', err)
      const report = await engine.getReport(config.paths.json_report)

      const data = await this.postProcessReport(runId, report, config.paths.json_report)
      await storage.createReport(this._db, data)

      record.state = 'Failed';
      record.finishedAt = new Date();
      record.scenarios = record.scenarios.map( s => {

        let test = report.tests.find( t => t.pair.label === s.label)
        if (test) {
          s.status = test.status;
        }
        else {
          console.warn('[QueueProcessor] Cannot find rest result for "'+s.label + '" in', report)
        }
        return s;
      });

      await this.updateScenariosRunStatus(record.scenarios)
      await storage.updateHistoryRecord(
        this._db,
        record._id,
        storage.convertToObject(record))

      return runId
    }
  }

  async processApproveCase (data) {

    console.log('[QueueProcessor] processApproveCase. pair.test:', data.test)

    let report = await storage.getReportById(this._db, data.reportId);

    if (
      !report || 
      !report.tests || 
      report.tests.length <= data.testCaseIndex || 
      !report.tests[data.testCaseIndex] || 
      !report.tests[data.testCaseIndex].pair
    ){
      console.error('[QueueProcessor] ERROR processApproveCase. Cannot find pair', data);
      return;
    }

    let pair = { 
      label: report.tests[data.testCaseIndex].pair.label, 
      reference: report.tests[data.testCaseIndex].pair.reference, 
      test: report.tests[data.testCaseIndex].pair.test
    }

    await this._flow.ApprovePreProcess(pair);

    const rootDir = filePathsService.vrtDataFullPath();
    const reference = path.join( rootDir, pair.reference );
    const test = path.join( rootDir, pair.test );
    const testFileExits = await exists(test);

    if (!testFileExits) {
      console.error('[QueueProcessor] ERR: Cannot find TEST result at', test);
      return {success:false, reason: 'Cannot find TEST result'};
    }

    await mkdir(path.dirname(reference), {recursive:true});
    await copyFile(test, reference);

    const results = await Promise.all([
      await storage.getScenarioByLabel(this._db, pair.label),
      await imageProcessor.resizeReference(reference)
    ]);

    const scenario = results[0];
    const resizes = results[1];

    await Promise.all([
      await storage.updateScenario(this._db, scenario._id, {
        meta_referenceImageUrl: pair.reference,
        meta_referenceSM: filePathsService.relativeToVrtDataPath( resizes.sm ),
        meta_referenceMD: filePathsService.relativeToVrtDataPath( resizes.md ),
        meta_referenceLG: filePathsService.relativeToVrtDataPath( resizes.lg ) //? NOT USED IN UI
      }),

      await storage.createHistoryRecord(this._db, {
        state: 'Approved',
        startedAt: new Date(),
        finishedAt: new Date(),
        startedBy: this._ctx.user,
        viewports: [ pair.viewportLabel ],
        scenarios: [{ id: scenario._id.toString(), label: scenario.label }]
      }),

      await this._flow.ApprovePostProcess({
        reference: pair.reference,
        sm: resizes.sm,
        md: resizes.md,
        lg: resizes.lg
      })
      // await bucketAdapter.upload( pair.reference ),
      // await bucketAdapter.upload( resizes.sm ),
      // await bucketAdapter.upload( resizes.md ),
      // await bucketAdapter.upload( resizes.lg ) //? NOT USED IN UI
    ]);
  }

  async postProcessReport (runId, jsonReport, reportLocation) {

    console.log('[Queue Processor] postProcessReport', runId, reportLocation);

    const reportAdapter = new JsonReportAdapter(jsonReport, reportLocation, runId);
    let report = reportAdapter.report;

    for ( let i = 0; i < report.tests.length; i++ ) {

      const results = await Promise.all([
        await imageProcessor.resizeTestResult( report.tests[i].pair.images.absolute.test ),
        await imageProcessor.resizeTestResult( report.tests[i].pair.images.absolute.diff ),
      ]);

      const meta_testLG = results[0];
      const meta_diffImageLG = results[1];

      report.tests[i].pair.meta_testLG = filePathsService.relativeToVrtDataPath( meta_testLG );
      report.tests[i].pair.meta_diffImageLG = filePathsService.relativeToVrtDataPath( meta_diffImageLG );

      await this._flow.RunPostProcess({
        ref: report.tests[i].pair.images.absolute.ref,
        diff: report.tests[i].pair.images.absolute.diff,
        test: report.tests[i].pair.images.absolute.test,
        meta_testLG: meta_testLG,
        meta_diffImageLG: meta_diffImageLG
      });

      // await Promise.all([
      //   // await bucketAdapter.upload( report.tests[i].pair.images.absolute.ref ),
      //   await bucketAdapter.upload( report.tests[i].pair.images.absolute.diff ),
      //   await bucketAdapter.upload( report.tests[i].pair.images.absolute.test ),
      //   await bucketAdapter.upload( meta_testLG ),
      //   await bucketAdapter.upload( meta_diffImageLG ),
      // ]);
    }

    return report
  }
}

module.exports = QueueProcessor;
