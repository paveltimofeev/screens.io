import { IAppConfig, IQueueService, IStorageService, ILogger } from '../../domain/models';

import { StorageService } from './storage.service';
import { QueueService } from './queue.service';

export class AwsFactory {

    static createStorageService (bucketName:string, logger: ILogger) : IStorageService {

        return new StorageService(
            bucketName,
            logger
        );
    }

    static createQueueService (logger: ILogger, config: IAppConfig) : IQueueService {

        return new QueueService(logger, config);
    }
}

