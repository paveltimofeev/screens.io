var assert = require('assert');

const { JsonReportAdapter } = require('../app_logic/engine-adapter')


describe('AppLogic', function () {

  describe('JsonReportAdapter', function () {

    it('should create Report object', function () {

      const jsonReport = {};
      const reportLocation = '';
      const runId = '123';

      const reportAdapter = new JsonReportAdapter(jsonReport, reportLocation, runId);

      assert.equal( 0, reportAdapter.report.tests.length );
    });

    it('should add runId', function () {

      const jsonReport = {};
      const reportLocation = '';
      const runId = '1234567890';

      const reportAdapter = new JsonReportAdapter(jsonReport, reportLocation, runId);

      assert.equal( runId, reportAdapter.report.runId);
    });

    it('should build relative and absolute paths', function () {

      const jsonReport = {
        "testSuite": "BackstopJS",
        "tests": [{
            "pair": {
              "reference": "..\\..\\bitmaps_reference\\REFERENCE.png",
              "test": "..\\..\\bitmaps_test\\20200702-220228\\TEST.png",
              "selector": "document",
              "fileName": "test-tenant_Okkoru_0_document_0_1920__1080.png",
              "label": "Okko.ru",
              "misMatchThreshold": 0.1,
              "url": "https://okko.ru",
              "expect": 0,
              "viewportLabel": "1920 × 1080",
              "diff": {
                "isSameDimensions": true,
                "dimensionDifference": { "width": 0, "height": 0 },
                "misMatchPercentage": "8.57",
                "analysisTime": 227
              },
              "diffImage": "..\\..\\bitmaps_test\\20200702-220228\\DIFFIMAGE.png"
            },
            "status": "fail"
          },
          {
            "pair": {
              "reference": "..\\..\\bitmaps_reference\\test-tenant_Coursetro_0_document_0_1920__1080.png",
              "test": "..\\..\\bitmaps_test\\20200702-220228\\test-tenant_Coursetro_0_document_0_1920__1080.png",
              "selector": "document",
              "fileName": "test-tenant_Coursetro_0_document_0_1920__1080.png",
              "label": "Coursetro",
              "misMatchThreshold": 0.1,
              "url": "https://coursetro.com/",
              "expect": 0,
              "viewportLabel": "1920 × 1080",
              "diff": {
                "isSameDimensions": true,
                "dimensionDifference": { "width": 0, "height": 0 },
                "misMatchPercentage": "0.00"
              }
            },
            "status": "pass"
          }
        ]
      };

      const reportLocation = 'vrt_data\\test-tenant\\5efdff882670d284bcde2a28\\json_report\\e75d4133-8f43-402b-8e2a-7e01d96865ec';
      const runId = '12345';

      const reportAdapter = new JsonReportAdapter(jsonReport, reportLocation, runId);

      assert.equal( jsonReport.tests.length, reportAdapter.report.tests.length);

      assert.equal( jsonReport.tests[0].pair.images.relative.ref, 'test-tenant\\5efdff882670d284bcde2a28\\bitmaps_reference\\REFERENCE.png', 'Wrong relative reference path');
      assert.equal( jsonReport.tests[0].pair.images.relative.diff, 'test-tenant\\5efdff882670d284bcde2a28\\bitmaps_test\\20200702-220228\\DIFFIMAGE.png', 'Wrong relative diffimage path');
      assert.equal( jsonReport.tests[0].pair.images.relative.test, 'test-tenant\\5efdff882670d284bcde2a28\\bitmaps_test\\20200702-220228\\TEST.png', 'Wrong relative test path');

      assert.equal( jsonReport.tests[0].pair.images.absolute.ref, 'C:\\Git\\screens.io\\backend\\vrt_data\\test-tenant\\5efdff882670d284bcde2a28\\bitmaps_reference\\REFERENCE.png', 'Wrong absolute reference path');
      assert.equal( jsonReport.tests[0].pair.images.absolute.diff, 'C:\\Git\\screens.io\\backend\\vrt_data\\test-tenant\\5efdff882670d284bcde2a28\\bitmaps_test\\20200702-220228\\DIFFIMAGE.png', 'Wrong absolute diffimage path');
      assert.equal( jsonReport.tests[0].pair.images.absolute.test, 'C:\\Git\\screens.io\\backend\\vrt_data\\test-tenant\\5efdff882670d284bcde2a28\\bitmaps_test\\20200702-220228\\TEST.png', 'Wrong absolute test path');
    });


    it('should change ref, test and dif paths related to jsonReport to related to vrt_data folder', function () {

      const jsonReport = {
        "testSuite": "BackstopJS",
        "tests": [{
          "pair": {
            "reference": "..\\..\\bitmaps_reference\\REFERENCE.png",
            "test": "..\\..\\bitmaps_test\\20200702-220228\\TEST.png",
            "selector": "document",
            "fileName": "test-tenant_Okkoru_0_document_0_1920__1080.png",
            "label": "Okko.ru",
            "misMatchThreshold": 0.1,
            "url": "https://okko.ru",
            "expect": 0,
            "viewportLabel": "1920 × 1080",
            "diff": {
              "isSameDimensions": true,
              "dimensionDifference": { "width": 0, "height": 0 },
              "misMatchPercentage": "8.57",
              "analysisTime": 227
            },
            "diffImage": "..\\..\\bitmaps_test\\20200702-220228\\DIFFIMAGE.png"
          },
          "status": "fail"
        }
        ]
      };

      const reportLocation = 'vrt_data\\test-tenant\\5efdff882670d284bcde2a28\\json_report\\e75d4133-8f43-402b-8e2a-7e01d96865ec';
      const runId = '12345';

      const reportAdapter = new JsonReportAdapter(jsonReport, reportLocation, runId);

      assert.equal( jsonReport.tests.length, reportAdapter.report.tests.length);

      assert.equal( jsonReport.tests[0].pair.reference, 'test-tenant\\5efdff882670d284bcde2a28\\bitmaps_reference\\REFERENCE.png', 'reference path should be related to vrt_data');
      assert.equal( jsonReport.tests[0].pair.test, 'test-tenant\\5efdff882670d284bcde2a28\\bitmaps_test\\20200702-220228\\TEST.png', 'diffImage path should be related to vrt_data');
      assert.equal( jsonReport.tests[0].pair.diffImage, 'test-tenant\\5efdff882670d284bcde2a28\\bitmaps_test\\20200702-220228\\DIFFIMAGE.png', 'test path should be related to vrt_data');
    });

  });

});
