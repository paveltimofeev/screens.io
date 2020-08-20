import { AppFactory } from './app/app-factory';
import { Logger } from './infrastructure/utils';
import { ConfigurationService } from './app/configuration-service';
import { TestWorker } from './domain/worker';
import { IIncomingQueueMessage } from './domain/models';

const logger = new Logger('Watcher');
const config = ConfigurationService.getAppConfig();

const factory = new AppFactory();
const queue = factory.createQueueAdapter();
const worker = new TestWorker(factory);

logger.log('watch queue');

const watch = async () => {

    let messages = await queue.receiveMessages();

    if (messages.length > 0) {

        logger.log('messages', messages.length);

        for (let i = 0; i < messages.length; i++) {

            const incomingMessage: IIncomingQueueMessage = messages[0].body;
            const queueMessageHandle: string = messages[i].handle;

            logger.log('message', incomingMessage.runId);

            // Start child process through semaphore
            const outgoingMessage = await worker.run(incomingMessage);
            await queue.deleteMessage(queueMessageHandle);
            const result = await queue.sendMessage(outgoingMessage);

            logger.log('done. runId', outgoingMessage.runId)
        }
    }
};

setInterval(watch, config.incomingQueue.pollingInterval);
