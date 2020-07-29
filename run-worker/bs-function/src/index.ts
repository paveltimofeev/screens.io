import { TestWorker } from './worker';
import { QueueMessageAdapter } from './queueMessageAdapter';


console.log('Loading bs-function');


exports.handler =  async function(event:any, context:any) {

  console.log(`[Handler] event: \n${JSON.stringify(event, null, 2)}`);

  const worker = new TestWorker();
  worker.run( QueueMessageAdapter.fromLambdaEvent(event) );

  return context.logStreamName
};
