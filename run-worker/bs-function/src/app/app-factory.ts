import { EngineAdapter } from './engine-adapter';
import { S3Flow } from './s3-flow';
import { JsonReportAdapter } from '../domain/json-report-adapter';
import { IAppConfig, IEngine, IFlow, IJsonReport } from '../domain/models';
import { ImageProcessor } from './image-processor';
import { FilePathsService } from './file-paths-service';
import { BucketAdapter } from './bucket-adapter';
import { ConfigurationService } from './configuration-service';
import { QueueAdapter } from './queue-adapter';
import { BackstopJsWrapper } from './backstop-js-wrapper';
import { Logger } from '../infrastructure/logger';
import { IStorageService, IQueueService, IReportReader } from '../domain/task-processor';
import { StorageService } from '../modules/aws/storage.service';
import { ReportReader } from '../modules/backstopjs/report-reader';
import { QueueService } from '../modules/aws/queue.service';

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS();
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const appConfig = ConfigurationService.getAppConfig();

export class AppFactory {

    getAppConfig (): IAppConfig {
        return ConfigurationService.getAppConfig();
    }

    createEngineAdapter () {
        return new EngineAdapter(
            this.createFilePathsService()
        );
    }

    createEngine () : IEngine {

        return new BackstopJsWrapper(
            new Logger('BackstopJsWrapper')
        )
    }

    createFlow () : IFlow {

        return new S3Flow(
            this.createBucketAdapter(),
            this.createFilePathsService()
        );
    }

    createBucketAdapter () {
        return new BucketAdapter(
            s3,
            appConfig.bucketName,
            this.createFilePathsService()
        );
    }

    createQueueAdapter () {

        return new QueueAdapter(sqs);
    }

    createJsonReportAdapter (report: IJsonReport, reportLocation:string, runId:string) {
        return new JsonReportAdapter(
            report,
            reportLocation,
            runId,
            this.createFilePathsService()
        );
    }

    createImageProcessor () {
        return new ImageProcessor();
    }

    createFilePathsService () {
        return new FilePathsService();
    }

    createLogger (label:string) : Logger {

        return new Logger(label);
    }

    createStorageService(): IStorageService {
        return new StorageService(
            appConfig.bucketName,
            this.createLogger('AWS:StorageService')
            );
    }
    createQueueService(): IQueueService {
        return new QueueService();
    }
    createReportReader(): IReportReader {
        return new ReportReader();
    }
}
