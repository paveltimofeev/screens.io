const AWS = require('aws-sdk');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const mime = require('mime');

const fileExists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);

AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const vrtDataPath = '..\\vrt_data\\';

const { FilePathsService } = require('./app-utils');
const filePathsService = new FilePathsService();


class BucketAdapter {

  constructor (bucketName) {
    this.bucket = bucketName;
  }

  log (msg, arg) {
    console.log(msg, arg);
  }

  error (msg, arg) {
    console.error(msg, arg);
  }

  localPathToBucketPath (filePath) {

    let subFolderPath = path.join(
      '/',
      filePathsService.vrtDataFolderName(),
      path.dirname(filePathsService.relativeToVrtDataPath(filePath))
    );

    return {
      subFolder: path.normalize(subFolderPath).replace(/\\/gi, '/'),
      key: path.basename(filePath)
    }
  }

  async upload ( file ) {

    this.log('[BucketAdapter] upload', file);

    if (!file) {
      this.log('[BucketAdapter] upload: empty file path.', file);
      return file
    }

    const exist = await fileExists(file);
    if (!exist) {
      this.log('[BucketAdapter] upload: file not exists.', file);
      return null;
    }

    const fileStream = fs.createReadStream(file);
    fileStream.on('error', (err) => {
      this.error('[BucketAdapter] ERROR. Read File Error', err);
    });

    const bucketPath = this.localPathToBucketPath(file);

    const uploadParams = {
      Bucket: this.bucket + bucketPath.subFolder,
      Key: bucketPath.key,
      Body: fileStream,
      ACL: 'public-read',
      // Expires: // The date and time at which the object is no longer cacheable. For more information, see http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
    };

    try {
      this.log('[BucketAdapter] upload to: bucket path', uploadParams.Bucket);
      this.log('[BucketAdapter] upload to: bucket key', uploadParams.Key);
      return await s3.upload( uploadParams ).promise();
    }
    catch (err) {

      const { Bucket, Key, ACL } = uploadParams;
      this.error('[BucketAdapter] s3.upload failed. uploadParams:', { Bucket, Key, ACL });
      this.error('[BucketAdapter] ERROR', err);
    }
  }

  async download (localPath) {

    this.log('[BucketAdapter] download');

    const bucketPath = this.localPathToBucketPath(localPath);

    const downloadParams = {
      Bucket: this.bucket + bucketPath.subFolder,
      Key: bucketPath.key
    };

    this.log('[BucketAdapter] downloadParams.Bucket', downloadParams.Bucket);
    this.log('[BucketAdapter] downloadParams.Key', downloadParams.Key);

    try {
      const data = await s3.getObject( downloadParams ).promise();
      await writeFile( localPath, data.Body );
      this.log( '[BucketAdapter] downloaded to', localPath );
    }
    catch (err) {
      this.error('[BucketAdapter] ERROR download', err)
    }
  }
}


module.exports = {
  BucketAdapter: BucketAdapter
};
