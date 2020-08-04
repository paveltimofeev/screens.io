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
  })
});
