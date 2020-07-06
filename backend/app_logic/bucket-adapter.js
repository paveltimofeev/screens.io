const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

AWS.config.update({region: 'us-east-1'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const vrtDataPath = '..\\vrt_data\\';


class BucketAdapter {

  localPathToBucketPath (filePath) {

    return path.relative(vrtDataPath, filePath)
  }

  async upload ( task ) {

    if (!task || !task.file || !task.bucket) {
      console.error('[BucketAdapter] ERROR upload', task);
      throw new Error('Wrong bucket upload task');
    }

    console.log('[BucketAdapter] upload', task);

    const fileStream = fs.createReadStream(task.file);
    fileStream.on('error', function(err) { console.log('File Error', err); });

    const uploadParams = {
      Bucket: task.bucket,
      Key: path.normalize( this.localPathToBucketPath(task.file) ),
      Body: fileStream,
      ACL: 'public-read'
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
