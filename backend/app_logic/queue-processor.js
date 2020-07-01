const storage = new (require('../storage/storage-adapter'));
const engine = new (require('../engine-adapter'));
const appUtils = require('./app-utils');
var backstop = require('backstopjs');

var path = require('path');
var fs = require('fs');
var { promisify } = require('util');
const exists = promisify(fs.exists);
const copyFile = promisify(fs.copyFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);


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

    console.log('[TaskProcessor] processRun. runId:', runId)

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

      //await writeFile('./backstop-config.debug.json', JSON.stringify(config), 'utf-8')
      await backstop('test', { config: config } )

      console.log('[VRT] `backstop test` command completed')

      const report = await engine.getReport(config.paths.json_report)
      await this.createReport(runId, report)

      record.state = 'Passed';
      record.finishedAt = new Date();
      record.scenarios = record.scenarios.map( s => {

        let test = report.tests.find( t => t.pair.label === s.label)
        if (test) {
          s.status = test.status;
        }
        else {
          console.warn('Cannot find test result for "'+s.label + '" in', report)
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
    catch (err) {

      console.error('[VRT] Error:', err)
      const report = await engine.getReport(config.paths.json_report)
      await this.createReport(runId, report)

      record.state = 'Failed';
      record.finishedAt = new Date();
      record.scenarios = record.scenarios.map( s => {

        let test = report.tests.find( t => t.pair.label === s.label)
        if (test) {
          s.status = test.status;
        }
        else {
          console.warn('Cannot find rest result for "'+s.label + '" in', report)
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

    console.log('[TaskProcessor] processApproveCase. pair.test:', pair.test)

    const reference = path.join(__dirname, '..', pair.reference);
    const test = path.join(__dirname, '..', pair.test);

    const testFileExits = await exists(test)

    if (!testFileExits) {
      console.error('ERR: Cannot find TEST result at', test);
      return {success:false, reason: 'Cannot find TEST result'};
    }

    await mkdir(path.dirname(reference), {recursive:true})
    await copyFile(test, reference)

    const date = new Date()
    const scenario = await storage.getScenarioByLabel(this._db, pair.label)

    await storage.updateScenario(this._db, scenario._id, {
      meta_referenceImageUrl: pair.reference
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
      .then( (r) => { console.log('[VRT] stop done', r); cb(null, r); })
      .catch( (e) => { console.log('[VRT] stop failed', e); cb(e);});
  }

  async createReport (runId, data) {

    data.runId = runId;
    return await storage.createReport(this._db, data )
  }
}

module.exports = QueueProcessor;
