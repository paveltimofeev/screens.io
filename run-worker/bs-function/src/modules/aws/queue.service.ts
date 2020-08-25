import { IQueueService, ILogger } from '../../domain/models';


const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS();


export class QueueService implements IQueueService {

    constructor (
        private readonly _logger: ILogger
    ){}

    async sendMessage(queueUri: string, messageBody: string): Promise<boolean> {

        this._logger.log('sendMessage');

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

        this._logger.log('deleteMessage');

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
