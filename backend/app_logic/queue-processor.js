const backstop = require('backstopjs');
const storage = new (require('../storage/storage-adapter'));
const engine = new (require('./engine-adapter'));
const appUtils = require('./app-utils');
const imageProcessor = require('./image-processor');

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const exists = promisify(fs.exists);
const copyFile = promisify(fs.copyFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const { BucketAdapter } = require('./bucket-adapter');
const bucketAdapter = new BucketAdapter('vrtdata');

const { FilePathsService } = require('./app-utils');
const filePathsService = new FilePathsService();


class QueueProcessor {

  constructor (ctx, dbName) {
    this._db = dbName;
    this._ctx = ctx;

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

  async processApproveCase (pair) {

    console.log('[QueueProcessor] processApproveCase. pair.test:', pair.test)

    const reference = path.join(__dirname, '..', pair.reference);
    const test = path.join(__dirname, '..', pair.test);

    const testFileExits = await exists(test)

    if (!testFileExits) {
      console.error('[QueueProcessor] ERR: Cannot find TEST result at', test);
      return {success:false, reason: 'Cannot find TEST result'};
    }

    await mkdir(path.dirname(reference), {recursive:true})
    await copyFile(test, reference)

    const date = new Date()

    const results = await Promise.all([
      await storage.getScenarioByLabel(this._db, pair.label),
      await imageProcessor.resizeReference(reference)
    ]);

    const scenario = results[0];
    const resizes = results[1];
    const rootDir = path.join(__dirname, '..');

    // await Promise.all([
    //   bucketAdapter.upload( filePathsService.pairItemFullPath(pair.reference) ),
    //   // bucketAdapter.upload( resizes.sm ),
    //   // bucketAdapter.upload( resizes.md ),
    //   // bucketAdapter.upload( resizes.lg ),
    // ]);

    await storage.updateScenario(this._db, scenario._id, {
      meta_referenceImageUrl: pair.reference,
      meta_referenceSM: resizes.sm.replace(rootDir, ''),
      meta_referenceMD: resizes.md.replace(rootDir, ''),
      meta_referenceLG: resizes.lg.replace(rootDir, '')
    });

    await storage.createHistoryRecord(this._db, {
      state: 'Approved',
      startedAt: date,
      finishedAt: date,
      startedBy: this._ctx.user,
      viewports: [ pair.viewportLabel ],
      scenarios: [{
        id: scenario._id.toString(),
        label: scenario.label
      }]
    })
  }

  stop (cb) {

    backstop( 'stop' )
      .then( (r) => { console.log('[QueueProcessor] stop done', r); cb(null, r); })
      .catch( (e) => { console.log('[QueueProcessor] stop failed', e); cb(e);});
  }

  async postProcessReport (runId, data, jsonReportPath) {

    console.log('[Queue Processor] postProcessReport', arguments);

    data.runId = runId;

    for ( let i = 0; i < data.tests.length; i++ ) {

      let t = data.tests[i];

      if (t.pair.test) {
        // TODO: need to improve work wit paths, m.b. use some sort of engine-path-adapter or converter
        const testResultPath = path.join( __dirname, '..', jsonReportPath, t.pair.test );
        const testLGPath = await imageProcessor.resizeTestResult(testResultPath);
        t.pair.meta_testLG = testLGPath.replace(path.join( __dirname, '..'), '');

        await bucketAdapter.upload( testLGPath );
      }

      if (t.pair.diffImage) {
        const diffImageLGPath = await imageProcessor.resizeTestResult(path.join( __dirname, '..', jsonReportPath, t.pair.diffImage ));
        t.pair.meta_diffImageLG = diffImageLGPath.replace(path.join( __dirname, '..'), '');

        await bucketAdapter.upload( diffImageLGPath );
      }
    }

    return data
  }
}

module.exports = QueueProcessor;
