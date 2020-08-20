const assert = require('assert');
const sinon = require('sinon');
const event = require('./event');
const handler = require( '../dist' ).handler;
const QueueMessageAdapter = require( '../dist/app/queue-message-adapter' ).QueueMessageAdapter;
const TestWorker = require( '../dist/domain/worker' ).TestWorker;
const AppFactory = require( '../dist/app/app-factory' ).AppFactory;
const QueueAdapter = require( '../dist/app/queue-adapter' ).QueueAdapter;


const shouldHaveImage = (report, testCaseIdx, imageKey) => {

  assert.notEqual(
    !report.tests[testCaseIdx].pair[imageKey],
    true,
    'should has "'+imageKey+'" for '+testCaseIdx+' test case');

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

    assert.equal(outgoingMessage.report.tests[0].status, 'fail');
    assert.equal(outgoingMessage.report.tests[1].status, 'fail');

    shouldHaveImage(outgoingMessage.report, 0, 'reference');
    shouldHaveImage(outgoingMessage.report, 0, 'test');
    // shouldHaveImage(outgoingMessage.report, 0, 'diffImage');

    shouldHaveImage(outgoingMessage.report, 1, 'reference');
    shouldHaveImage(outgoingMessage.report, 1, 'test');
    shouldNotHaveImage(outgoingMessage.report, 1, 'diffImage');

    shouldHaveDifferentImages(outgoingMessage.report, 'reference');
    shouldHaveDifferentImages(outgoingMessage.report, 'test');
    // shouldHaveDifferentImages(outgoingMessage.report, 'diffImage');


    console.log('> reference', outgoingMessage.report.tests[0].pair.reference);
    console.log('> test', outgoingMessage.report.tests[0].pair.test);
    console.log('> diffImage', outgoingMessage.report.tests[0].pair.diffImage);

    assert.equal(
      outgoingMessage.report.tests[0].pair.reference.toLowerCase().startsWith('c:\\'),
      false,
      'reference path should not start be absolute');



  })
});

describe('QueueAdapter', () => {

  it('should send a message to valid queue', async () => {

    const outgoingMessage = {
      tenantId: 'tenant-id',
      userId: 'user-id',
      runId: 'run-id',
      report: null
    };

    const factory = new AppFactory();
    const queueAdapter = factory.createQueueAdapter();
    const result = await queueAdapter.sendMessage(outgoingMessage);

    assert.notEqual(result.ResponseMetadata.RequestId, null);
    assert.notEqual(result.MessageId, null);
    assert.notEqual(result.MD5OfMessageBody, null);
  });
});
