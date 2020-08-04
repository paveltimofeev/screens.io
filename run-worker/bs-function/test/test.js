const assert = require('assert');
const event = require('./event');
const handler = require( '../dist' ).handler;
const QueueMessageAdapter = require( '../dist/queue-message-adapter' ).QueueMessageAdapter;
const TestWorker = require( '../dist/worker' ).TestWorker;
const AppFactory = require( '../dist/app-factory' ).AppFactory;


describe('TestWorker', () => {

  it('should return outgoingMessage with the same scope', async () => {

    const incomingMessage = QueueMessageAdapter.fromLambdaEvent(event);

    const factory = new AppFactory();
    const worker = new TestWorker(factory);
    const outgoingMessage = await worker.run(incomingMessage);

    assert.equal(outgoingMessage.tenantId, incomingMessage.tenantId);
    assert.equal(outgoingMessage.runId, incomingMessage.runId);
    assert.equal(outgoingMessage.userId, incomingMessage.userId);

    assert.equal(outgoingMessage.report.tests.length, incomingMessage.config.scenarios.length * incomingMessage.config.viewports.length);

    assert.notEqual(!outgoingMessage.report.tests[0].pair.reference, true, 'should has REFERENCE for first test case');
    assert.notEqual(!outgoingMessage.report.tests[0].pair.test, true, 'should has TEST for first test case');
    assert.notEqual(!outgoingMessage.report.tests[0].pair.diffImage, true, 'should has DIFFIMAGE for first test case');
    assert.notEqual(!outgoingMessage.report.tests[0].pair.meta_testLG, true, 'should has META_TESTLG for first test case');
    assert.notEqual(!outgoingMessage.report.tests[0].pair.meta_diffImageLG, true, 'should has META_DIFFIMAGELG for first test case');

    assert.notEqual(!outgoingMessage.report.tests[1].pair.reference, true, 'should has REFERENCE for second test case');
    assert.notEqual(!outgoingMessage.report.tests[1].pair.test, true, 'should has TEST for second test case');
    // assert.notEqual(!outgoingMessage.report.tests[1].pair.diffImage, true, 'should has DIFFIMAGE for second test case');
    assert.notEqual(!outgoingMessage.report.tests[1].pair.meta_testLG, true, 'should has META_TESTLG for second test case');
    // assert.notEqual(!outgoingMessage.report.tests[1].pair.meta_diffImageLG, true, 'should has META_DIFFIMAGELG for second test case');

    assert.notEqual(
      outgoingMessage.report.tests[0].pair.reference,
      outgoingMessage.report.tests[1].pair.reference, 'should not has the same REFERENCE images for different viewport cases');
    assert.notEqual(
      outgoingMessage.report.tests[0].pair.test,
      outgoingMessage.report.tests[1].pair.test, 'should not has the same TEST images for different viewport cases');
    assert.notEqual(
      outgoingMessage.report.tests[0].pair.diffImage,
      outgoingMessage.report.tests[1].pair.diffImage, 'should not has the same DIFFIMAGE images for different viewport cases');
    assert.notEqual(
      outgoingMessage.report.tests[0].pair.meta_testLG,
      outgoingMessage.report.tests[1].pair.meta_testLG, 'should not has the same META_TESTLG images for different viewport cases');
    assert.notEqual(
      outgoingMessage.report.tests[0].pair.meta_diffImageLG,
      outgoingMessage.report.tests[1].pair.meta_diffImageLG, 'should not has the same META_DIFFIMAGELG images for different viewport cases');

  })
});
