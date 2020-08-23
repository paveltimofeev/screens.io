import { IQueueService } from "../../domain/task-processor";
import SQS = require('aws-sdk/clients/sqs');


const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS();


export class QueueService implements IQueueService {
    
    constructor (){}

    async sendMessage(queueUri: string, messageBody: string): Promise<boolean> {

        console.log('sendMessage');

        const outgoingParams = {
            QueueUrl: queueUri,
            MessageBody: messageBody
        };

        try {
            const res = await sqs.sendMessage(outgoingParams).promise();
            console.log(res);
            return true;
        }
        catch(err) {
            console.error(err);
            return false;
        }
    }
    
    async deleteMessage(queueUri: string, messageHandler: string): Promise<boolean> {
        
        console.log('deleteMessage');

        const params = {
            QueueUrl: queueUri,
            ReceiptHandle: messageHandler
        };

        try {
            const res = await sqs.deleteMessage(params).promise();
            console.log(res);
            return true;
        }
        catch(err){
            console.error(err);
            return false;
        }
    }
}
