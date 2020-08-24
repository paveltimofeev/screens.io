const assert = require('assert');
const sinon = require('sinon');

const { AppFactory } = require( '../dist/app/app-factory' );
const { TaskProcessor } = require( '../dist/domain/task-processor' );


function mockMethod (mockingObj, method, returnValue) {

    let mock = sinon.mock(mockingObj);
    mock.expects(method).once().returns(returnValue);
    return mock;
}

describe('TaskProcessor', () => {

    it('should be green', () => {
        assert.equal(1,1)
    });

    it('should run', async () => {

        const factory = new AppFactory();

        const storageService = factory.createStorageService();
        const engine = factory.createEngine();
        const reportReader = factory.createReportReader();
        const queueService = factory.createQueueService();
        const logger = factory.createLogger('TaskProcessor');
        const appConfig = factory.getAppConfig();

        const storageService_getMock = mockMethod(storageService, 'get', true);
        const engineMock = mockMethod(engine, 'test', {success: true});
        const reportReaderMock = mockMethod(reportReader, 'read', {
            resultFiles : [
                'results/test1.png',
                'results/diff1.png',
                'results/test2.png',
                'results/diff2.png'
            ]
        });
        const storageService_saveMock = mockMethod(storageService, 'save', true);
        const queueService_sendMock = mockMethod(queueService, 'sendMessage', true);
        const queueService_delMock = mockMethod(queueService, 'deleteMessage', true);
        const loggerMock = mockMethod(logger, 'log', null);

        const processor = new TaskProcessor(
            storageService,
            engine,
            reportReader,
            queueService,
            appConfig,
            logger
        );

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

        const success = await processor.run( task );

        assert.equal(success, true, 'TaskProcessor.run() should returns true in case of success')

        storageService_getMock.verify();
        engineMock.verify();
        reportReaderMock.verify();
        storageService_saveMock.verify();
        queueService_sendMock.verify();
        queueService_delMock.verify();
        loggerMock.verify();
    });

    xit('should not fail if cannot download references', async () => {});

    xit('should take into account tenant and username info', async () => {});
});

describe('ReportReader', () => {

    it('should read jsonReport', async () => {

        const factory = new AppFactory();
        const reportReader = factory.createReportReader();

        const report = await reportReader.read('./test/');

        assert.notEqual(report.jsonReport, null);
        assert.notEqual(report.jsonReport, undefined);

        assert.equal(report.resultFiles.length === 17, true);
        assert.equal(
          report.resultFiles.every(x => x.length > 0),
          true,
          'all returned paths should not be empty sting');
    });
});
