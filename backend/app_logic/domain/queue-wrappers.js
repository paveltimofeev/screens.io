
class LocalQueueWrapper {

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


const localApproveQueue = new LocalQueueWrapper(approveProcessor);



const sendToApproveQueue = async (task) => {

  const {data, ctx} = task;

  if(!data || !ctx) {
    console.error('Wrong approve task', task);
    throw new Error('Wrong approve task');
  }

  await localApproveQueue.push(task);
};


module.exports = {
  sendToApproveQueue: sendToApproveQueue
};
