import { TestWorker } from './worker';
import { QueueMessageAdapter } from './queue-message-adapter';
import { EngineAdapter } from './engine-adapter';
import { S3Flow } from './s3-flow';
import { Logger } from './utils';

const logger = new Logger('Handler');
console.log('Loading bs-function');


exports.handler =  async function(event:any, context:any) {

  logger.log('event', event);

  const engine = new EngineAdapter();
  const flow = new S3Flow();
  const incomingMessage = QueueMessageAdapter.fromLambdaEvent(event);

  const worker = new TestWorker(engine, flow);
  await worker.run(incomingMessage);

  return context.logStreamName
};
