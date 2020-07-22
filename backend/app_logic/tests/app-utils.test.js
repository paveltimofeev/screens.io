var { FilePathsService } = require('../app-utils');


var files = new FilePathsService()

console.log( 'vrtDataFullPath :', files.vrtDataFullPath() );

console.log( 'referenceFullPath :', files.pairItemFullPath("..\\bitmaps_reference\\test-tenant_Instagram_0_document_0_1920__1080.png") );
console.log( 'testFullPath :', files.pairItemFullPath("..\\bitmaps_test\\20200703-230335\\test-tenant_Instagram_0_document_0_1920__1080.png") );
console.log( 'diffFullPath :', files.pairItemFullPath("..\\bitmaps_test\\20200703-230335\\failed_diff_test-tenant_Instagram_0_document_0_1920__1080.png") );

console.log( 'referenceRelativePath :', files.pairItemRelativePath("..\\bitmaps_reference\\test-tenant_Instagram_0_document_0_1920__1080.png") );
console.log( 'testRelativePath :', files.pairItemRelativePath("..\\bitmaps_test\\20200703-230335\\test-tenant_Instagram_0_document_0_1920__1080.png") );
console.log( 'diffRelativePath :', files.pairItemRelativePath("..\\bitmaps_test\\20200703-230335\\failed_diff_test-tenant_Instagram_0_document_0_1920__1080.png") );


console.log( 'relativeToVrtDataPath :', files.relativeToVrtDataPath("C:\\Git\\screens.io\\backend\\vrt_data\\bitmaps_test\\20200703-230335\\test-tenant_Instagram_0_document_0_1920__1080.png") );

console.log( 'reportItemFullPath :', files.reportItemFullPath("..\\..\\bitmaps_reference\\test-tenant_Okkoru_0_document_0_1920__1080.png") );
