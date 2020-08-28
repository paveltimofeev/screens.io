import { IQueueService, ILogger, IIncomingQueueMessage, IAppConfig } from '../../domain/models';
import { safeParse } from '../infratructure/utils';
import { Message } from 'aws-sdk/clients/sqs';


const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS();


export class QueueService implements IQueueService {

    constructor (
        private readonly _logger: ILogger,
        private readonly _config: IAppConfig
    ){}

    async receiveMessages (queueUri: string) : Promise<IIncomingQueueMessage[]> {

        const params = {
            QueueUrl: queueUri,
            MaxNumberOfMessages: this._config.incomingQueue.maxNumberOfMessages,
            VisibilityTimeout: this._config.incomingQueue.visibilityTimeout,
            WaitTimeSeconds: this._config.incomingQueue.waitTimeSeconds
        };

        let messages = await sqs.receiveMessage( params ).promise();
        if (!messages || !messages.Messages) {
            return [];
        }

        this._logger.log('receiveMessages', messages.Messages.length);

        return messages.Messages
            .map( (x:Message) => {

                let message = safeParse<IIncomingQueueMessage>(x.Body, null);
                message.messageId = x.ReceiptHandle;
                return message
            })
            .filter((x:any) => x.body !== null);
    }

    async sendMessage(queueUri: string, messageBody: string): Promise<boolean> {

        this._logger.log('sendMessage', queueUri);

        const outgoingParams = {
            QueueUrl: queueUri,
            MessageBody: messageBody
        };

        try {
            await sqs.sendMessage(outgoingParams).promise();
            return true;
        }
        catch(err) {
            this._logger.error('Cannot send message to SQS', err);
            return false;
        }
    }

    async deleteMessage(queueUri: string, messageHandler: string): Promise<boolean> {

        this._logger.log('deleteMessage', queueUri);

        const params = {
            QueueUrl: queueUri,
            ReceiptHandle: messageHandler
        };

        try {
            await sqs.deleteMessage(params).promise();
            return true;
        }
        catch(err){
            this._logger.error('Cannot delete message', err);
            return false;
        }
    }
}
