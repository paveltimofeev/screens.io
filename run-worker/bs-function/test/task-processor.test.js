const assert = require('assert');
const sinon = require('sinon');

const { AppFactory } = require( '../dist/app/app-factory' );
const { TaskProcessor } = require( '../dist/domain/task-processor' );


describe('TaskProcessor', () => {

    it('should be green', () => {
        assert.equal(1,1)
    })

    it('should run', async () => {

        const factory = new AppFactory();

        const storageService = factory.createStorageService();
        const engine = factory.createEngine();
        const reportReader = factory.createReportReader();
        const queueService = factory.createQueueService();

        var spy = sinon.spy();
        var storageServiceMock = sinon.mock(storageService);
        storageServiceMock.expects('get').once().returns(true);
        
        var engineMock = sinon.mock(engine);
        engineMock.expects('test').once().returns( {success: true} );
        
        var reportReaderMock = sinon.mock(reportReader);
        reportReaderMock.expects('read').once().returns( {resultFiles: [
            'results/test1.png',
            'results/diff1.png'
        ]} );
        
        const processor = new TaskProcessor(
            storageService,
            engine,
            reportReader,
            queueService
        )

        const task = {
            message: { 
                config: {
                    scenarios: [
                        { meta_referenceImageUrl: 'ref/image-1.png' },
                        { meta_referenceImageUrl: 'ref/image-2.png' }
                    ],
                    paths: {
                        bitmaps_reference: 'ref-folder',
                        json_report: 'report-folder'
                    }
                }
            },
            handler: 'queue-message-handler'
        };

        await processor.run( task );
    })
})
