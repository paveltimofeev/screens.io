import { EngineAdapter } from './engine-adapter';
import { S3Flow } from './s3-flow';
import { JsonReportAdapter } from './json-report-adapter';
import { IJsonReport } from './models';
import { ImageProcessor } from './image-processor';
import { FilePathsService } from './file-paths-service';
import { BucketAdapter } from './bucket-adapter';
import { ConfigurationService } from './configuration-service';

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
            appConfig.bucketName,
            this.createFilePathsService()
        );
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
