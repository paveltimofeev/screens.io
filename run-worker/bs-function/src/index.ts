import { TestWorker } from './worker';
import { QueueMessageAdapter } from './queue-message-adapter';
import { Logger } from './utils';
import { AppFactory } from './app-factory';

const logger = new Logger('Handler');
console.log('Loading bs-function');


exports.handler = async function(event:any, context:any) {

  logger.log('event', event);

  const incomingMessage = QueueMessageAdapter.fromLambdaEvent(event);

  const factory = new AppFactory();
  const worker = new TestWorker(factory);
  const outgoingMessage = await worker.run(incomingMessage);

  return context.logStreamName
};
