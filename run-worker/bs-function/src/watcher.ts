import { AppFactory } from './app/app-factory';
import { Logger } from './infrastructure/logger';
import { ConfigurationService } from './app/configuration-service';
import { TestWorker } from './domain/worker';
import { IIncomingQueueMessage } from './domain/models';
import { Task, TaskProcessor } from './domain/task-processor';

const logger = new Logger('Watcher');
const config = ConfigurationService.getAppConfig();

const factory = new AppFactory();
const queue = factory.createQueueAdapter();
const worker = new TestWorker(factory);

logger.log('watch queue');

const storageService = factory.createStorageService();
const engine = factory.createEngine();
const reportReader = factory.createReportReader();
const queueService = factory.createQueueService();
const taskProcessorLogger = factory.createLogger('TaskProcessor');
const appConfig = factory.getAppConfig();

const processor = new TaskProcessor(
    storageService,
    engine,
    reportReader,
    queueService,
    appConfig,
    taskProcessorLogger
);

const watch = async () => {

    let messages = await queue.receiveMessages();

    if (messages.length > 0) {

        logger.log('messages', messages.length);

        for (let i = 0; i < messages.length; i++) {

            const incomingMessage: IIncomingQueueMessage = messages[0].body;
            const queueMessageHandle: string = messages[i].handle;

            logger.log('message', incomingMessage.runId);

            const task = new Task();
            task.handler = queueMessageHandle;
            task.message = incomingMessage;
            await processor.run(task);


            // Start child process through semaphore
            // const outgoingMessage = await worker.run(incomingMessage);
            // await queue.deleteMessage(queueMessageHandle);
            // const result = await queue.sendMessage(outgoingMessage);
            // logger.log('done. runId', outgoingMessage.runId)
        }
    }
};

setInterval(watch, config.incomingQueue.pollingInterval);
