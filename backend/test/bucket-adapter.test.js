const assert = require('assert');
const sinon = require('sinon');

const sandbox = sinon.createSandbox();
const { FilePathsService } = require('../app_logic/modules/infrastructure/app-utils');
const { BucketAdapter } = require('../app_logic/modules/aws/bucket-adapter');


describe('BucketAdapter', function () {

  describe('Paths convertations', function () {

    let filePathsService;

    beforeEach(function() {
      filePathsService = new FilePathsService();
    });

    afterEach(function() {
      sandbox.restore()
    });

    it('FilePathsService vrtData full path', function () {

      sandbox.replace(filePathsService, 'vrtDataFullPath', () => '/var/app/current/backend/vrt_data' );

      const relativePath = filePathsService.relativeToVrtDataPath('/var/app/current/backend/vrt_data/tenant\\userid\\folder\\filename.png');
      assert.equal(relativePath, "tenant\\userid\\folder\\filename.png")
    });

    it('should support unix path', function () {

      /*
      [BucketAdapter] download /var/app/current/backend/vrt_data/test-tenant\5efdff882670d284bcde2a28\bitmaps_reference\test-tenant_Instagram_0_document_0_1920__1080.png
      [BucketAdapter] downloadParams.Bucket vrtdata/vrt_data
      [BucketAdapter] downloadParams.Key test-tenant\5efdff882670d284bcde2a28\bitmaps_reference\test-tenant_Instagram_0_document_0_1920__1080.png
      [BucketAdapter] ERROR download { NoSuchKey: The specified key does not exist. }
      */

      sandbox.replace(filePathsService, 'vrtDataFullPath', () => '/var/app/current/backend/vrt_data' );

      const ba = new BucketAdapter('bucketName', filePathsService);

      const bucketPath = ba.localPathToBucketPath(
        '/var/app/current/backend/vrt_data/tenant\\userid\\bitmaps_reference\\filename.png');

      assert.equal( bucketPath.subFolder, '/tenant/userid/bitmaps_reference', 'wrong subFolder' );
      assert.equal( bucketPath.key, 'filename.png', 'wrong key' );
    });

    it('should support windows path', function () {

      /*
      [BucketAdapter] download C:\Git\screens.io\backend\vrt_data\vrt_data\test-tenant\5e9767c2a802d03004b160dc\bitmaps_reference\test-tenant__0_document_0_1366__768.png
      [BucketAdapter] downloadParams.Bucket vrtdata/vrt_data/vrt_data/test-tenant/5e9767c2a802d03004b160dc/bitmaps_reference
      [BucketAdapter] downloadParams.Key test-tenant__0_document_0_1366__768.png
      */

      sandbox.replace(filePathsService, 'vrtDataFullPath', () => 'C:\\Git\\screens.io\\backend\\vrt_data' );

      const ba = new BucketAdapter('bucketName', filePathsService);

      const bucketPath = ba.localPathToBucketPath(
        'C:\\Git\\screens.io\\backend\\vrt_data\\tenant\\userid\\bitmaps_reference\\filename.png');

      assert.equal( bucketPath.subFolder, '/tenant/userid/bitmaps_reference', 'wrong subFolder');
      assert.equal( bucketPath.key, 'filename.png', 'wrong key');
    });

  });
});
