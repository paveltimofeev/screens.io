const config = require('../modules/infrastructure/configuration');
const { QueueAdapter } = require('../modules/aws/queue-adapter');
const { QueueWatcher } = require('../modules/aws/queue-watcher');

const resultsQueue = new QueueAdapter(config.resultsQueueUrl);
const queueWatcher = new QueueWatcher(resultsQueue);
queueWatcher.watch(5000, async (result) => {

  // result.report
  // result.runId
  // result.ctx.tenant
  // result.ctx.userid

  console.log(`[QueueWatcher handler] receive message`, result.runId);
  console.log(`[QueueWatcher handler] message ctx`, result.ctx);

  const {runId, report, ctx} = result;

  const validate = (param, errMessage) => {
    if( !param ) {
      console.error( `[Results Processor] ERROR: Invalid result message. ${errMessage}`, result );
      return false;
    }
    return true;
  };

  if (
    !validate(runId, 'No runId') ||
    !validate(report, 'No report') ||
    !validate(ctx, 'No ctx')
  ) {
    return;
  }

  console.log(`[Results Processor] test results. runId="${result.runId}"`, result);

  const QueueProcessor = require('./queue-processor');
  await QueueProcessor.create(ctx).saveReport(runId, report)


  /*
    {
      "runId": "976e9810-4f68-4e29-bcd0-a4565fe058f3",

      "ctx": {
        "tenant": "test-tenant",
        "userid": "5e9767c2a802d03004b160dc"
      }

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
    }
  */
});
