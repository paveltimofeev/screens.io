import { IAppConfig, IEngine, ILogger } from '../domain/models';
import { IStorageService, IQueueService, IReportReader } from '../domain/models';

import { AwsFactory } from '../modules/aws/aws-factory';

import { EngineFactory } from '../modules/backstopjs/engine-factory';
import { BackstopJsWrapper } from '../modules/backstopjs/backstop-js-wrapper';

import { Logger } from '../modules/infratructure/logger';
import { ConfigurationService } from '../modules/infratructure/configuration.service';


export class AppFactory {

    getAppConfig (): IAppConfig {
        return ConfigurationService.getAppConfig();
    }

    createEngine () : IEngine {

        return new BackstopJsWrapper(
            this.createLogger('Engine:BackstopJsWrapper')
        )
    }

    createLogger (label:string) : ILogger {

        return new Logger(label);
    }

    createStorageService(): IStorageService {

        return AwsFactory.createStorageService(
            this.getAppConfig().bucketName,
            this.createLogger('AWS:StorageService')
        );
    }

    createQueueService(): IQueueService {

        return AwsFactory.createQueueService(
            this.createLogger('AWS:QueueService'),
            this.getAppConfig()
        );
    }

    createReportReader(): IReportReader {

        return EngineFactory.createReportReader(
            this.createLogger('BackstopJS:ReportReader')
        );
    }
}
