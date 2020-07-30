import { BucketAdapter } from "./bucket-adapter";
import { FilePathsService } from "./file-paths-service";
import { IConfig } from './models';

console.log('[Media Storage] Init S3 Strategy');

const path = require('path');


export class S3Flow {

    bucketAdapter: BucketAdapter = new BucketAdapter('vrtdata', new FilePathsService());
    filePathsService: FilePathsService = new FilePathsService();

    async RunPreProcess (config:IConfig) {

      console.log('[S3Flow] RunPreProcess');

      /// download ref images of every scenario in config and place them to corresponding directory

      for ( let i = 0; i < config.scenarios.length; i++ ) {

        if (config.scenarios[i].meta_referenceImageUrl) {

          await this.bucketAdapter.download(
            path.join(
              this.filePathsService.vrtDataFullPath(),
              config.scenarios[ i ].meta_referenceImageUrl
            )
          );
        }
      }
    }

    async RunPostProcess (images:{
        ref:string,
        diff:string,
        test: string,
        meta_testLG: string,
        meta_diffImageLG: string
    }) {

      console.log('[S3Flow] RunPostProcess');

      await Promise.all([
     // await this.bucketAdapter.upload( images.ref ),
        await this.bucketAdapter.upload( images.diff ),
        await this.bucketAdapter.upload( images.test ),
        await this.bucketAdapter.upload( images.meta_testLG ),
        await this.bucketAdapter.upload( images.meta_diffImageLG ),
      ]);

      // [delete successfully uploaded images]
    }

    async ApprovePreProcess (pair: { test:string }) {

      console.log('[S3Flow] ApprovePreProcess');

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

      console.log('[S3Flow] ApprovePostProcess');

      await Promise.all([
        await this.bucketAdapter.upload( images.reference ),
        await this.bucketAdapter.upload( images.sm ),
        await this.bucketAdapter.upload( images.md ),
        await this.bucketAdapter.upload( images.lg ) //? NOT USED IN UI
      ]);

      // [delete successfully uploaded images]
    }
}
