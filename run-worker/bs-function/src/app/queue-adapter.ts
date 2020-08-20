import { IIncomingQueueMessage, IOutgoingQueueMessage } from '../domain/models';
import { Logger, safeParse } from '../infrastructure/utils';
import { ConfigurationService } from './configuration-service';
import SQS = require('aws-sdk/clients/sqs');

const logger = new Logger('QueueAdapter');
const config = ConfigurationService.getAppConfig();

export class QueueAdapter {

    private sqs: SQS;

    constructor (sqs: SQS) {
        this.sqs = sqs;
    }

    async sendMessage (message:IOutgoingQueueMessage) {

        logger.log('sendMessage. runId', message.runId);

        const outgoingParams = {
            QueueUrl: config.outgoingQueue.queueUrl,
            MessageBody: JSON.stringify( message )
        };

        return await this.sqs.sendMessage(outgoingParams).promise();
    }

    async receiveMessages () : Promise<{handle: string, body: IIncomingQueueMessage}[]> {

        const params = {
            QueueUrl: config.incomingQueue.queueUrl,
            MaxNumberOfMessages: config.incomingQueue.maxNumberOfMessages,
            VisibilityTimeout: config.incomingQueue.visibilityTimeout,
            WaitTimeSeconds: config.incomingQueue.waitTimeSeconds,
            AttributeNames: [ 'SentTimestamp' ],
            MessageAttributeNames: [ 'All' ]
        };

        let messages = await this.sqs.receiveMessage( params ).promise();

        if (!messages || !messages.Messages) {
            return [];
        }

        logger.log('receiveMessages', messages.Messages.length);

        return messages.Messages
            .map( x => {

                return {
                    handle: x.ReceiptHandle,
                    body: safeParse<IIncomingQueueMessage>(x.Body, null)
                };
            })
            .filter(x => x.body !== null);
    }

    async deleteMessage (handler:string) {

        logger.log('deleteMessage');

        const params = {
            QueueUrl: config.incomingQueue.queueUrl,
            ReceiptHandle: handler
        };

        return this.sqs.deleteMessage(params).promise();
    }
}
