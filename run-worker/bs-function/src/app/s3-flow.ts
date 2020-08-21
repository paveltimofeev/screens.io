import { BucketAdapter } from "./bucket-adapter";
import { FilePathsService } from "./file-paths-service";
import { IConfig, IFlow } from '../domain/models';
import { Logger } from '../infrastructure/utils';

const logger = new Logger('S3Flow');
const path = require('path');

logger.log('[Media Storage] Init S3 Strategy');

export class S3Flow implements IFlow {

    bucketAdapter: BucketAdapter;
    filePathsService: FilePathsService;

    constructor (bucketAdapter: BucketAdapter, filePathsService: FilePathsService) {

        this.bucketAdapter = bucketAdapter;
        this.filePathsService = filePathsService;
    }

    async RunPreProcess (config:IConfig) {

        logger.log('RunPreProcess');

        // download ref images of every scenario in config
        // and place them to corresponding directory

        for (let i = 0; i < config.scenarios.length; i++) {

            if (config.scenarios[i].meta_referenceImageUrl) {

                const success = await this.bucketAdapter.download(
                    path.join(
                        this.filePathsService.vrtDataFullPath(),
                        config.scenarios[i].meta_referenceImageUrl
                    )
                );
            }
        }
    }

    async RunPostProcess (images: {diff:string, test:string}) {

        logger.log('RunPostProcess');

        await Promise.all([
            await this.bucketAdapter.uploadAndDelete( images.diff ),
            await this.bucketAdapter.uploadAndDelete( images.test )
        ]);
    }

    async ApprovePreProcess (pair: { test:string }) {

        logger.log('ApprovePreProcess');

      await this.bucketAdapter.download(
        path.join(
          this.filePathsService.vrtDataFullPath(),
          pair.test
        )
      );
    }

    async ApprovePostProcess (images:{
        reference: string,
        sm: string,
        md: string,
        lg: string
    }) {

        logger.log('ApprovePostProcess');

        await Promise.all([
            await this.bucketAdapter.uploadAndDelete( images.reference ),
            await this.bucketAdapter.uploadAndDelete( images.sm ),
            await this.bucketAdapter.uploadAndDelete( images.md ),
            await this.bucketAdapter.uploadAndDelete( images.lg ) //? NOT USED IN UI
        ]);
    }
}
