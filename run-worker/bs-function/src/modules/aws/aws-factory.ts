import { IQueueService, IStorageService } from '../../domain/task-processor';
import { ILogger } from '../../domain/models';
import { StorageService } from './storage.service';
import { QueueService } from './queue.service';

export class AwsFactory {

    static createStorageService (bucketName:string, logger: ILogger) : IStorageService {

        return new StorageService(
            bucketName,
            logger
        );
    }

    static createQueueService (logger: ILogger) : IQueueService {

        return new QueueService(logger);
    }
}

