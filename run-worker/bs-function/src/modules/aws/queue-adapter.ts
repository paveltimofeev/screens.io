import { IIncomingQueueMessage, IOutgoingQueueMessage } from '../../domain/models';
import { Logger } from '../infratructure/logger';
import { safeParse } from '../infratructure/utils';
import { ConfigurationService } from '../infratructure/configuration.service';

const logger = new Logger('QueueAdapter');
const config = ConfigurationService.getAppConfig();

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS();

export class QueueAdapter {


    async sendMessage (message:IOutgoingQueueMessage) {

        logger.log('sendMessage. runId', message.runId);

        const outgoingParams = {
            QueueUrl: config.outgoingQueue.queueUrl,
            MessageBody: JSON.stringify( message )
        };

        return await sqs.sendMessage(outgoingParams).promise();
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

        let messages = await sqs.receiveMessage( params ).promise();

        if (!messages || !messages.Messages) {
            return [];
        }

        logger.log('receiveMessages', messages.Messages.length);

        return messages.Messages
            .map( (x:any) => {

                return {
                    handle: x.ReceiptHandle,
                    body: safeParse<IIncomingQueueMessage>(x.Body, null)
                };
            })
            .filter((x:any) => x.body !== null);
    }

    async deleteMessage (handler:string) {

        logger.log('deleteMessage');

        const params = {
            QueueUrl: config.incomingQueue.queueUrl,
            ReceiptHandle: handler
        };

        return sqs.deleteMessage(params).promise();
    }
}
