import { FilePathsService } from './file-paths-service';
import { Logger } from '../infrastructure/logger';
import S3 = require('aws-sdk/clients/s3');

const logger = new Logger('BucketAdapter');

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const fileExists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);
const deleteFile = promisify(fs.unlink);


export class BucketAdapter {

  s3: S3;
  bucket: string;
  filePathsService: FilePathsService;

  constructor (s3: S3, bucketName: string, filePathsService: FilePathsService) {
    this.s3 = s3;
    this.bucket = bucketName;
    this.filePathsService = filePathsService;
  }

  private localPathToBucketPath (filePath:string) {

    let subFolderPath = path.join(
      '/',
      path.dirname(this.filePathsService.relativeToVrtDataPath(filePath))
    );

    return {
      subFolder: path.normalize(subFolderPath).replace(/\\/gi, '/'),
      key: path.basename(filePath)
    }
  }

  async uploadAndDelete (filePath: string) {

    if (!filePath) {
      logger.log('upload: empty file path. Return.', filePath);
      return filePath
    }

    logger.log(`upload: ${filePath}`);

    const exist = await fileExists(filePath);
    if (!exist) {
      logger.log('upload: file not exists.', filePath);
      return null;
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (err:any) => {
      logger.error('[BucketAdapter] ERROR. Read File Error', err);
    });

    const bucketPath = this.localPathToBucketPath(filePath);

    const uploadParams = {
      Bucket: this.bucket + bucketPath.subFolder,
      Key: bucketPath.key,
      Body: fileStream,
      ACL: 'public-read',
      // Expires: // The date and time at which the object is no longer cacheable.
      // For more information, see http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
    };

    try {
      logger.log('upload to: bucket path', uploadParams.Bucket);
      logger.log('upload to: bucket key', uploadParams.Key);
      await this.s3.upload( uploadParams ).promise();
      logger.log('delete uploaded', filePath);
      await deleteFile(filePath)
    }
    catch (err) {

      const { Bucket, Key, ACL } = uploadParams;
      logger.error('upload', err);
      logger.error('s3.upload failed. uploadParams:', { Bucket, Key, ACL });
    }
  }

  async download (localPath: string): Promise<boolean> {

    logger.log('download to', localPath);

    const bucketPath = this.localPathToBucketPath(localPath);
    const downloadParams = {
      Bucket: this.bucket + bucketPath.subFolder,
      Key: bucketPath.key
    };

    logger.log('downloadParams.Bucket', downloadParams.Bucket);
    logger.log('downloadParams.Key', downloadParams.Key);

    try {

      const data = await this.s3.getObject( downloadParams ).promise();
      logger.log( 'downloaded, write to', localPath );
      await writeFile( localPath, data.Body );
      logger.log( 'written to', localPath );

      return true
    }
    catch (err) {
      logger.error('download', err);

      return false
    }
  }
}
