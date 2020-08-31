const storage = new (require('../modules/storage/storage-adapter'));
const { JsonReportAdapter } = require('../modules/engine/engine-adapter');
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

    validateParams('user');
    validateParams('tenant');
    validateParams('userid');

    return new QueueProcessor(ctx, ctx.userid);
  }


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
}

module.exports = QueueProcessor;
