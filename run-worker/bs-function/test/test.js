const assert = require('assert');
const sinon = require('sinon');
const event = require('./event');
const handler = require( '../dist' ).handler;
const QueueMessageAdapter = require( '../dist/queue-message-adapter' ).QueueMessageAdapter;
const TestWorker = require( '../dist/worker' ).TestWorker;
const AppFactory = require( '../dist/app-factory' ).AppFactory;


const shouldHaveImage = (report, testCaseIdx, imageKey) => {

  assert.notEqual(
    !report.tests[testCaseIdx].pair[imageKey],
    true,
    'should has "'+imageKey+'" for first test case');

  assert.equal(report.tests[testCaseIdx].pair[imageKey].length > 0,
    true,
    '"'+imageKey+'" should be longer then 0.')
};

const shouldNotHaveImage = (report, testCaseIdx, imageKey) => {

  assert.notEqual(
    !report.tests[testCaseIdx].pair[imageKey],
    false,
    'should NOT has "'+imageKey+'" for first test case');
};

const shouldHaveDifferentImages = (report, imageKey) => {

  assert.notEqual(
    report.tests[0].pair[imageKey],
    report.tests[1].pair[imageKey],
    'should not has the same "'+imageKey+'" images for different viewport cases');
};


describe('TestWorker', () => {

  const sandbox = sinon.createSandbox();
  const factory = new AppFactory();

  beforeEach(function() {
    sandbox.spy(factory, "createBucketAdapter");
    sandbox.spy(factory, "createFilePathsService");
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should return outgoingMessage with the same scope', async () => {

    const incomingMessage = QueueMessageAdapter.fromLambdaEvent(event);

    const worker = new TestWorker(factory);
    const outgoingMessage = await worker.run(incomingMessage);

    console.log( '> createBucketAdapter callCount', factory.createBucketAdapter.callCount );
    console.log( '> createFilePathsService callCount', factory.createFilePathsService.callCount );

    assert.equal(outgoingMessage.tenantId, incomingMessage.tenantId);
    assert.equal(outgoingMessage.runId, incomingMessage.runId);
    assert.equal(outgoingMessage.userId, incomingMessage.userId);

    assert.equal(outgoingMessage.report.tests.length, incomingMessage.config.scenarios.length * incomingMessage.config.viewports.length);

    shouldHaveImage(outgoingMessage.report, 0, 'reference');
    shouldHaveImage(outgoingMessage.report, 0, 'test');
    shouldHaveImage(outgoingMessage.report, 0, 'meta_testLG');
    shouldHaveImage(outgoingMessage.report, 0, 'diffImage');
    shouldHaveImage(outgoingMessage.report, 0, 'meta_diffImageLG');

    shouldHaveImage(outgoingMessage.report, 1, 'reference');
    shouldHaveImage(outgoingMessage.report, 1, 'test');
    shouldHaveImage(outgoingMessage.report, 1, 'meta_testLG');
    shouldNotHaveImage(outgoingMessage.report, 1, 'diffImage');
    shouldNotHaveImage(outgoingMessage.report, 1, 'meta_diffImageLG');

    shouldHaveDifferentImages(outgoingMessage.report, 'reference');
    shouldHaveDifferentImages(outgoingMessage.report, 'test');
    shouldHaveDifferentImages(outgoingMessage.report, 'diffImage');
    shouldHaveDifferentImages(outgoingMessage.report, 'meta_testLG');
    shouldHaveDifferentImages(outgoingMessage.report, 'meta_diffImageLG');
  })
});
