import { AppFactory } from './app/app-factory';
import { Task, IIncomingQueueMessage } from './domain/models';
import { TaskProcessor } from './domain/task-processor';

const factory = new AppFactory();
const config = factory.getAppConfig();
const logger = factory.createLogger('Watcher');

logger.log('watch queue');

const queue = factory.createQueueAdapter();
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
        }
    }
};

setInterval(watch, config.incomingQueue.pollingInterval);
