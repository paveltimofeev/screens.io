console.log( 'Tests:' );
const handler = require( './dist/index' );

const event = {
  tenantId : 'tenant-id',
  userId : 'user-id',
  runId : 'run-id',
  config : {
    "id" : "test-tenant",
    "viewports" : [ { "label" : "800 × 600", "width" : 800, "height" : 600, "enabled" : true } ],
    "scenarios" : [ {
      "authConfig" : { "enabled" : false },
      "hideSelectors" : [],
      "removeSelectors" : [],
      "selectors" : [],
      "stubContentRules" : [],
      "_id" : "5f208d69d2c42e0284b88542",
      "label" : "Habr",
      "url" : "https://habr.com/en/all/",
      "meta_recentRunStatus" : "fail",
      "meta_referenceImageUrl" : "test-tenant\\5e9767c2a802d03004b160dc\\bitmaps_reference\\test-tenant_Habr_0_document_0_800__600.png",
      "meta_referenceLG" : "test-tenant\\5e9767c2a802d03004b160dc\\bitmaps_reference\\test-tenant_Habr_0_document_0_800__600_lg.jpg",
      "meta_referenceMD" : "test-tenant\\5e9767c2a802d03004b160dc\\bitmaps_reference\\test-tenant_Habr_0_document_0_800__600_md.jpg",
      "meta_referenceSM" : "test-tenant\\5e9767c2a802d03004b160dc\\bitmaps_reference\\test-tenant_Habr_0_document_0_800__600_sm.jpg"
    } ],
    "onBeforeScript" : "puppet/onBefore.js",
    "onReadyScript" : "puppet/onReady.js",
    "report" : [ "CI", "json" ],
    "engine" : "puppeteer",
    "engineOptions" : { "args" : [ "--no-sandbox" ] },
    "asyncCaptureLimit" : 5,
    "asyncCompareLimit" : 50,
    "debug" : false,
    "debugWindow" : false,
    "paths" : {
      "bitmaps_reference" : "C:\\Git\\screens.io\\backend\\vrt_data/test-tenant/5e9767c2a802d03004b160dc/bitmaps_reference",
      "engine_scripts" : "app_logic/engine_scripts",
      "bitmaps_test" : "C:\\Git\\screens.io\\backend\\vrt_data/test-tenant/5e9767c2a802d03004b160dc/bitmaps_test",
      "html_report" : "C:\\Git\\screens.io\\backend\\vrt_data/test-tenant/5e9767c2a802d03004b160dc/html_report",
      "ci_report" : "C:\\Git\\screens.io\\backend\\vrt_data/test-tenant/5e9767c2a802d03004b160dc/ci_report",
      "json_report" : "C:\\Git\\screens.io\\backend\\vrt_data\\test-tenant\\5e9767c2a802d03004b160dc\\json_report\\0e850ead-5b1c-410d-abb4-271801eed6f2"
    }
  }
};

const context = {};


handler.handler( event, context );
