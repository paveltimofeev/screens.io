const bucketAdaper = require('./bucket-adapter');

const task = {
  file: '../vrt_data/test-tenant/5efdff882670d284bcde2a28/bitmaps_test/20200706-113121/test.jpg',
  bucket: 'vrtdata'
};

(async () => {

  console.log(
    '..\\vrt_data\\test-tenant\\5efdff882670d284bcde2a28\\bitmaps_test\\20200706-113121\\test.jpg',
    bucketAdaper.localPathToBucketPath(
      '..\\vrt_data\\test-tenant\\5efdff882670d284bcde2a28\\bitmaps_test\\20200706-113121\\test.jpg'
    )
  );

  try {
    let res = await bucketAdaper.upload( task );
    console.log('SUCCESS:', res.Location);
  }
  catch(err) {
    console.error(err);
    console.error('ERROR:', err.message)
  }

})();

