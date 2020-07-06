const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const vrtDataPath = '..\\vrt_data\\';


class BucketAdapter {

  localPathToBucketPath (filePath) {

    let bucketPath = path.normalize( path.relative(vrtDataPath, filePath) );

    return {
      subFolder: '/' + path.dirname(bucketPath).replace(/\\/g, '/'),
      key: path.basename(bucketPath)
    }
  }

  async upload ( task ) {

    if (!task || !task.file || !task.bucket) {
      console.error('[BucketAdapter] ERROR upload', task);
      throw new Error('Wrong bucket upload task');
    }
    console.log('[BucketAdapter] upload', task);


    const fileStream = fs.createReadStream(task.file);
    fileStream.on('error', function(err) { console.log('File Error', err); });

    const bucketPath = this.localPathToBucketPath(task.file);

    const uploadParams = {
      Bucket: task.bucket + bucketPath.subFolder,
      Key: bucketPath.key,
      Body: fileStream,
      ACL: 'public-read',
      // Expires: // The date and time at which the object is no longer cacheable. For more information, see http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
    };

    return await s3.upload(uploadParams).promise();
  }

  download () {}
}


const bucketAdapter = new BucketAdapter();


module.exports = {
  localPathToBucketPath: bucketAdapter.localPathToBucketPath,
  upload: bucketAdapter.upload,
  download: bucketAdapter.download,
};
