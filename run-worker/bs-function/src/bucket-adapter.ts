import { FilePathsService } from './file-paths-service';
import { Logger } from './utils';

const logger = new Logger('BucketAdapter');

const AWS = require('aws-sdk');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const fileExists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);

AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});


export class BucketAdapter {

  bucket:string;
  filePathsService: FilePathsService;

  constructor (bucketName:string, filePathsService: FilePathsService) {
    this.bucket = bucketName;
    this.filePathsService = filePathsService;
  }

  localPathToBucketPath (filePath:string) {

    let subFolderPath = path.join(
      '/',
      path.dirname(this.filePathsService.relativeToVrtDataPath(filePath))
    );

    return {
      subFolder: path.normalize(subFolderPath).replace(/\\/gi, '/'),
      key: path.basename(filePath)
    }
  }

  async upload ( file:string ) {

    logger.log('upload', file);

    if (!file) {
      logger.log('upload: empty file path. RETURN', file);
      return file
    }

    const exist = await fileExists(file);
    if (!exist) {
      logger.log('upload: file not exists.', file);
      return null;
    }

    const fileStream = fs.createReadStream(file);
    fileStream.on('error', (err:any) => {
      logger.error('[BucketAdapter] ERROR. Read File Error', err);
    });

    const bucketPath = this.localPathToBucketPath(file);

    const uploadParams = {
      Bucket: this.bucket + bucketPath.subFolder,
      Key: bucketPath.key,
      Body: fileStream,
      ACL: 'public-read',
      // Expires: // The date and time at which the object is no longer cacheable. For more information, see http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
    };

    logger.log('uploadParams.Bucket', uploadParams.Bucket);
    logger.log('uploadParams.Key', uploadParams.Key);

    try {
      logger.log('upload to: bucket path', uploadParams.Bucket);
      logger.log('upload to: bucket key', uploadParams.Key);
      return await s3.upload( uploadParams ).promise();
    }
    catch (err) {

      const { Bucket, Key, ACL } = uploadParams;
      logger.error('upload', err);
      logger.error('s3.upload failed. uploadParams:', { Bucket, Key, ACL });
    }
  }

  async download (localPath:string) {

    logger.log('download', localPath);

    const bucketPath = this.localPathToBucketPath(localPath);

    const downloadParams = {
      Bucket: this.bucket + bucketPath.subFolder,
      Key: bucketPath.key
    };

    logger.log('downloadParams.Bucket', downloadParams.Bucket);
    logger.log('downloadParams.Key', downloadParams.Key);

    try {
      const data = await s3.getObject( downloadParams ).promise();
      await writeFile( localPath, data.Body );
      logger.log( 'downloaded to', localPath );
    }
    catch (err) {
      logger.error('download', err)
    }
  }
}
