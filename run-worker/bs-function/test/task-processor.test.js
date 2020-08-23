const assert = require('assert');
const sinon = require('sinon');

const { AppFactory } = require( '../dist/app/app-factory' );
const { TaskProcessor } = require( '../dist/domain/task-processor' );


describe('TaskProcessor', () => {

    it('should be green', () => {
        assert.equal(1,1)
    })

    it('', async () => {

        const factory = new AppFactory();

        const storageService = factory.createStorageService();
        const engine = factory.createEngine();
        const reportReader = factory.createReportReader();
        const queueService = factory.createQueueService();

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
