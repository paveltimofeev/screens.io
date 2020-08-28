const { QueueAdapter } = require('./queue-adapter');
const config = require('./configuration');
const appUtils = require('./app-utils');


class RemoteQueueWrapper {

  constructor (processingCallback, queueUrl) {

    this.runQueue = new QueueAdapter(queueUrl);

    // Do not poll queue if there is no processor
    if (processingCallback) {
      setInterval( async () => {

        const m = await this.runQueue.receive();
        if( !m.Messages ) {
          return;
        }

        const tasks = m.Messages.map( x => ({
          handle : x.ReceiptHandle,
          body : appUtils.safeParse( x.Body )
        }) );

        for ( let i = 0; i < tasks.length; i++ ) {
          processingCallback( tasks[ i ].body );
          await this.runQueue.delete( tasks[ i ].handle )
        }

      }, config.queuePollInterval || 5000 ); // 5sec
    }
  }

  push (obj) {
    this.runQueue.push(obj)
    console.log( '---[RemoteQueueWrapper]. Pushed item to Queue. Length', this.runQueue.length )
  }
}

class QueueWrapper {

  constructor (processingCallback) {

    this.runQueue = []

    setInterval(async () => {

      while(this.runQueue.length > 0) {
        console.log( '---[Process Queue]. Length', this.runQueue.length )
        await processingCallback(this.runQueue.pop())
      }

    }, 500);
  }

  push (obj) {
    this.runQueue.push(obj)
    console.log( '---[QueueWrapper]. Pushed item to Queue. Length', this.runQueue.length )
  }
}

const approveProcessor = async (task) => {

  const {data, ctx} = task;

  const QueueProcessor = require('./queue-processor');
  await QueueProcessor.create(ctx).processApproveCase(data);
};

const resultsProcessor = async (result) => {

  /*
  {
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
    },

    "runId": "976e9810-4f68-4e29-bcd0-a4565fe058f3",

    "ctx": {
      "tenant": "test-tenant",
      "userid": "5e9767c2a802d03004b160dc"
    }
  }
  */

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
};

const localApproveQueue = new QueueWrapper(approveProcessor);
const remoteRunQueue = new RemoteQueueWrapper(null, config.taskQueueUrl);
const remoteResultsQueue = new RemoteQueueWrapper(resultsProcessor, config.resultsQueueUrl);


const sendToRunQueue = async (task) => {

  const {runId, config, ctx} = task;

  if(!runId || !config || !ctx) {
    console.error('Wrong run task', task);
    throw new Error('Wrong run task');
  }

  const QueueProcessor = require('./queue-processor');
  await QueueProcessor.create(ctx).createHistoryRecord(runId, config)

  await remoteRunQueue.push(task);
};

const sendToApproveQueue = async (task) => {

  const {data, ctx} = task;

  if(!data || !ctx) {
    console.error('Wrong approve task', task);
    throw new Error('Wrong approve task');
  }

  await localApproveQueue.push(task);
};


module.exports = {
  sendToRunQueue: sendToRunQueue,
  sendToApproveQueue: sendToApproveQueue
};
