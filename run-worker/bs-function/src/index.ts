import { TestWorker } from './worker';
import { QueueMessageAdapter } from './queue-message-adapter';
import { EngineAdapter } from './engine-adapter';
import { S3Flow } from './s3-flow';


console.log('Loading bs-function');


exports.handler =  async function(event:any, context:any) {

  console.log(`[Handler] event: \n${JSON.stringify(event, null, 2)}`);

  const worker = new TestWorker(
      new EngineAdapter(),
      new S3Flow()
  );

  worker.run( QueueMessageAdapter.fromLambdaEvent(event) );

  return context.logStreamName
};
