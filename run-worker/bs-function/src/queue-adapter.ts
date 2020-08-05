import { IOutgoingQueueMessage } from './models';
import { Logger } from './utils';
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
            QueueUrl: config.outgoingQueueUrl,
            MessageBody: JSON.stringify( message )
        };

        return await this.sqs.sendMessage(outgoingParams).promise();
    }
}
