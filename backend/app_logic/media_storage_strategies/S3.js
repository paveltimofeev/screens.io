console.log('[Media Storage] Init S3 Strategy');

const path = require('path');
const { FilePathsService } = require('../app-utils');
const { BucketAdapter } = require('../bucket-adapter');

const bucketAdapter = new BucketAdapter('vrtdata');
const filePathsService = new FilePathsService();


class S3Flow {

    constructor () {
      
      this.bucketAdapter = new BucketAdapter('vrtdata');
      this.filePathsService = new FilePathsService();  
    }
  
    async RunPreProcess (config) {
        
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
    async RunPostProcess (images) {
      
      await Promise.all([
     // await this.bucketAdapter.upload( images.ref ),
        await this.bucketAdapter.upload( images.diff ),
        await this.bucketAdapter.upload( images.test ),
        await this.bucketAdapter.upload( images.meta_testLG ),
        await this.bucketAdapter.upload( images.meta_diffImageLG ),
      ]);
  
      // [delete successfully uploaded images]
    }
  
    async ApprovePreProcess (pair) {
      
      await this.bucketAdapter.download(
        path.join(
          this.filePathsService.vrtDataFullPath(),
          pair.test
        )
      );
      
    }
    async ApprovePostProcess (images) {
  
      await Promise.all([
        await this.bucketAdapter.upload( images.reference ),
        await this.bucketAdapter.upload( images.sm ),
        await this.bucketAdapter.upload( images.md ),
        await this.bucketAdapter.upload( images.lg ) //? NOT USED IN UI
      ]);
  
      // [delete successfully uploaded images]
    }
}
  

const createFlow = () => {

    console.log('[Media Storage] Creating S3 Flow');
    return new S3Flow();
}

module.exports = {
    createFlow: createFlow
}
