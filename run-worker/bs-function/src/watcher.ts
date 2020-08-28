import { AppFactory } from './app/app-factory';
import { Task } from './domain/models';
import { TaskProcessor } from './domain/task-processor';
import { IIncomingQueueMessage } from './domain/incoming-queue-message.model';

const factory = new AppFactory();
const config = factory.getAppConfig();
const logger = factory.createLogger('Watcher');
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


logger.log('watch queue', config.incomingQueue.queueUrl);

const watchLoop = async () => {

    let messages;

    try {
        messages = await queueService.receiveMessages(config.incomingQueue.queueUrl);
    }
    catch (err) {

        if (err.code === 'AWS.SimpleQueueService.NonExistentQueue') {
            logger.error(err.message, err);
        }
        return;
    }

    if (messages.length > 0) {

        logger.log('messages', messages.length);

        for (let i = 0; i < messages.length; i++) {

            const incomingMessage: IIncomingQueueMessage = messages[0];

            logger.log('Job runId', incomingMessage.runId);

            const task = new Task();
            task.message = incomingMessage;
            await processor.run(task);
        }
    }
};

logger.log('pollingInterval', config.incomingQueue.pollingInterval);
if (!config.incomingQueue.pollingInterval) {
    logger.error('incomingQueue.pollingInterval is undefined');
    process.exit(1);
}

setInterval(watchLoop, config.incomingQueue.pollingInterval);
