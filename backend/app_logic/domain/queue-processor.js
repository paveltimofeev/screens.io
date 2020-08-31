const storage = new (require('../modules/storage/storage-adapter'));
const appUtils = require('../modules/infrastructure/app-utils');
const { EngineAdapter, JsonReportAdapter } = require('../modules/engine/engine-adapter');
const { FilePathsService } = require('../modules/infrastructure/app-utils');
const imageProcessor = require('../image-processor');

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const exists = promisify(fs.exists);
const copyFile = promisify(fs.copyFile);

const mkdir = promisify(fs.mkdir);

const filePathsService = new FilePathsService();

const config = require('../modules/infrastructure/configuration');
console.log('[QueueProcessor] Loading module', '../modules/media_storage_strategies/' + config.mediaStorageStrategy);
const mediaStorageStrategy = require('../modules/media_storage_strategies/' + config.mediaStorageStrategy);

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
        var err = new Error(`Bad request. Not valid context. No ${name} in request context`)
        err.status = 400
        throw err;
      }
    }

    // validateParams('user');
    validateParams('tenant');
    validateParams('userid');

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

  // async processRun (runId, config) {
  //
  //   console.log('[QueueProcessor] STARTED processRun. runId:', runId)
  //
  //   const record = await this.createHistoryRecord(runId, config)
  //
  //   try {
  //
  //     await this._flow.RunPreProcess( config );
  //
  //     await backstop('test', { config: config } )
  //
  //     try {
  //       console.log( '[QueueProcessor] `backstop test` command completed' )
  //
  //       const report = await engine.getReport( config.paths.json_report )
  //
  //       const data = await this.postProcessReport( runId, report, config.paths.json_report )
  //       // await storage.createReport( this._db, data )
  //       //
  //       // record.state = 'Passed';
  //       // record.finishedAt = new Date();
  //       // record.scenarios = record.scenarios.map( s => {
  //       //
  //       //   let test = report.tests.find( t => t.pair.label === s.label )
  //       //   if( test ) {
  //       //     s.status = test.status;
  //       //   } else {
  //       //     console.warn( '[QueueProcessor] Cannot find test result for "' + s.label + '" in', report )
  //       //   }
  //       //   return s;
  //       // } );
  //       //
  //       // await this.updateScenariosRunStatus( record.scenarios )
  //       // await storage.updateHistoryRecord( this._db, record._id, storage.convertToObject( record ) )
  //     }
  //     catch (err) {
  //       console.error('[QueueProcessor] Success report processing failed', err)
  //       throw err;
  //     }
  //
  //     console.log('[QueueProcessor] COMPLETED, PASSED processRun. runId:', runId);
  //     return runId
  //   }
  //   catch (err) {
  //
  //     console.error('[QueueProcessor] Error:', err)
  //     const report = await engine.getReport(config.paths.json_report)
  //
  //     const data = await this.postProcessReport(runId, report, config.paths.json_report)
  //     await storage.createReport(this._db, data)
  //
  //     record.state = 'Failed';
  //     record.finishedAt = new Date();
  //     record.scenarios = record.scenarios.map( s => {
  //
  //       let test = report.tests.find( t => t.pair.label === s.label)
  //       if (test) {
  //         s.status = test.status;
  //       }
  //       else {
  //         console.warn('[QueueProcessor] Cannot find rest result for "'+s.label + '" in', report)
  //       }
  //       return s;
  //     });
  //
  //     await this.updateScenariosRunStatus(record.scenarios)
  //     await storage.updateHistoryRecord(
  //       this._db,
  //       record._id,
  //       storage.convertToObject(record))
  //
  //     console.log('[QueueProcessor] COMPLETED, NOT PASSED processRun. runId:', runId);
  //     return runId
  //   }
  // }

  async processApproveCase (data) {

    console.log('[QueueProcessor] STARTED processApproveCase. pair.test:', data.test)

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
    const resizedReference = results[1];

    await Promise.all([
      await storage.updateScenario(this._db, scenario._id, {
        meta_referenceImageUrl: pair.reference,
        meta_referenceSM: filePathsService.relativeToVrtDataPath( resizedReference.sm ),
        meta_referenceMD: filePathsService.relativeToVrtDataPath( resizedReference.md ),
        meta_referenceLG: filePathsService.relativeToVrtDataPath( resizedReference.lg ) //? NOT USED IN UI
      }),

      await storage.createHistoryRecord(this._db, {
        state: 'Approved',
        startedAt: new Date(),
        finishedAt: new Date(),
        startedBy: this._ctx.userid,
        // startedBy: this._ctx.user,
        viewports: [ pair.viewportLabel ],
        scenarios: [{ id: scenario._id.toString(), label: scenario.label }]
      }),

      await this._flow.ApprovePostProcess({
        reference: pair.reference,
        sm: resizedReference.sm,
        md: resizedReference.md,
        lg: resizedReference.lg
      })
    ]);

    console.log('[QueueProcessor] COMPLETED processApproveCase. reportId', data.reportId)
  }


  async saveReport (runId, report) {

    /*
      "runId": "976e9810-4f68-4e29-bcd0-a4565fe058f3"

      "report": {
        "testSuite": "BackstopJS",
        "tests": [
          {
            "pair": {
              "reference": "..\\..\\bitmaps_reference\\test-tenant_rakutencojp_0_document_0_800__600.png",
              "test": "..\\..\\bitmaps_test\\20200829-005505\\test-tenant_rakutencojp_0_document_0_800__600.png",
              "selector": "document",
              "fileName": "test-tenant_rakutencojp_0_document_0_800__600.png",
              "label": "rakuten.co.jp",
              "misMatchThreshold": 0.1,
              "url": "https://www.rakuten.co.jp/",
              "expect": 0,
              "viewportLabel": "800 × 600",
              "error": "Reference file not found C:\\Git\\screens.io\\backend\\vrt_data\\test-tenant\\5e9767c2a802d03004b160dc\\bitmaps_reference\\test-tenant_rakutencojp_0_document_0_800__600.png"
            },
            "status": "fail"
          }
        ]
      }
    */

    await storage.createReport( this._db, report );

    let record = await storage.getHistoryRecords(this._db, {runId});

    record.state = 'Passed';
    record.finishedAt = new Date();
    record.scenarios = (record.scenarios||[]).map( s => {

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
    }

    return report
  }
}

module.exports = QueueProcessor;
