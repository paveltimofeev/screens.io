import { EngineAdapter } from './engine-adapter';
import { S3Flow } from './s3-flow';
import { JsonReportAdapter } from './json-report-adapter';
import { IJsonReport } from './models';
import { ImageProcessor } from './image-processor';
import { FilePathsService } from './file-paths-service';
import { BucketAdapter } from './bucket-adapter';
import { ConfigurationService } from './configuration-service';
import { QueueAdapter } from './queue-adapter';

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS();
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

const appConfig = ConfigurationService.getAppConfig();

export class AppFactory {

    createEngineAdapter () {
        return new EngineAdapter(
            this.createFilePathsService()
        );
    }

    createFlow () {
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
}
