const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});


class QueueAdapter {

    constructor (queueUrl) {
        this.sqs = new AWS.SQS();
        this.queueUrl = queueUrl;
    }

    async push (message) {

        console.log('[QueueAdapter] push. runId', message.runId);

        const params = {
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify( message )
        };

        return await this.sqs.sendMessage( params ).promise();
    }

    async receive () {

        const params = {
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0,
            AttributeNames: [ "SentTimestamp" ],
            MessageAttributeNames: [ "All" ]
        };

        return await this.sqs.receiveMessage( params ).promise();
    }

    async delete (messageOrHandler) {

        const params = {
            QueueUrl: this.queueUrl,
            ReceiptHandle: messageOrHandler.ReceiptHandle || messageOrHandler
        };
        console.log("[QueueAdapter] deleting", params);
        await this.sqs.deleteMessage( params ).promise();
    }

    async receiveAndDelete (processingAsync) {

        const messages = await this.receive()

        if (!messages.Messages) {
            return;
        }

        await processingAsync( messages.Messages.map( x => JSON.parse( x.Body ) ) )

        for (let i = 0; i < messages.length; i++) {
            await this.delete(messages[i].ReceiptHandle)
        }
    }
}


module.exports = {
    QueueAdapter: QueueAdapter
};
