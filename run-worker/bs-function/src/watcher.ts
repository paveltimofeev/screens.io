import { AppFactory } from './app/app-factory';
import { Logger } from './infrastructure/utils';

const logger = new Logger('Watcher');
const factory = new AppFactory();
const queue = factory.createQueueAdapter();

const watch = async () => {

    logger.log('tick');

    let messages = await queue.receiveMessages();

    if (messages.length > 0) {
        console.log('messages', messages)
    }
};

setInterval(watch, 500);
