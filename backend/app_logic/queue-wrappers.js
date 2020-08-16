const { QueueAdapter } = require('./queue-adapter');
const config = require('./configuration');

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
    console.log( '---[Process Queue]. Pushed item to Queue. Length', this.runQueue.length )
  }
}

const taskProcessor = async (task) => {

  const {runId, config, ctx} = task;
  const QueueProcessor = require('./queue-processor');
  await QueueProcessor.create(ctx).processRun(runId, config)
}

const localRunQueue = new QueueWrapper(taskProcessor);

const localApproveQueue = new QueueWrapper(async (task) => {

  const {data, ctx} = task;

  const QueueProcessor = require('./queue-processor');
  await QueueProcessor.create(ctx).processApproveCase(data);
});

const taskQueue = new QueueAdapter(config.taskQueueUrl);

setInterval(async () => {
  
  taskQueue.receiveAndDelete( async (tasks) => {
    for (let i = 0; i < tasks.length; i++) {
      await taskProcessor(tasks[i]);
    }
  });

}, 500);

const sendToRunQueue = async (task) => {

  const {runId, config, ctx} = task;

  if(!runId || !config || !ctx) {
    console.error('Wrong run task', task);
    throw new Error('Wrong run task');
  }

  await taskQueue.push(task);
  await localRunQueue.push(task);
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
