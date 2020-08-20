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

      }, config.queuePollInterval || 500 );
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


const taskProcessor = async (task) => {

  const {runId, config, ctx} = task;

  const QueueProcessor = require('./queue-processor');
  await QueueProcessor.create(ctx).processRun(runId, config)
};

const approveProcessor = async (task) => {

  const {data, ctx} = task;

  const QueueProcessor = require('./queue-processor');
  await QueueProcessor.create(ctx).processApproveCase(data);
};


const localApproveQueue = new QueueWrapper(approveProcessor);
const localRunQueue = new QueueWrapper(taskProcessor);
const remoteRunQueue = new RemoteQueueWrapper(null, config.taskQueueUrl);


const sendToRunQueue = async (task) => {

  const {runId, config, ctx} = task;

  if(!runId || !config || !ctx) {
    console.error('Wrong run task', task);
    throw new Error('Wrong run task');
  }

  await localRunQueue.push(task);
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
