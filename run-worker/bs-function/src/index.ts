import { TestWorker } from './domain/worker';
import { QueueMessageAdapter } from './app/queue-message-adapter';
import { Logger } from './infrastructure/utils';
import { AppFactory } from './app/app-factory';

const logger = new Logger('Handler');
logger.log('Loading bs-function');

exports.handler = async function(event:any, context:any) {

  logger.log('event', event);

  const incomingMessage = QueueMessageAdapter.fromLambdaEvent(event);

  const factory = new AppFactory();
  const worker = new TestWorker(factory);
  const outgoingMessage = await worker.run(incomingMessage);

  const queueAdapter = factory.createQueueAdapter();
  const result = await queueAdapter.sendMessage(outgoingMessage);

  return context.logStreamName
};
