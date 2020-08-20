import { IConfig, IIncomingQueueMessage, IOutgoingQueueMessage } from '../domain/models';
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
            QueueUrl: config.outgoingQueueUrl,
            MessageBody: JSON.stringify( message )
        };

        return await this.sqs.sendMessage(outgoingParams).promise();
    }

    async receiveMessages () : Promise<IIncomingQueueMessage[]> {

        const params = {
            QueueUrl: config.incomingQueueUrl,
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0,
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
                return safeParse<IIncomingQueueMessage>(x.Body, null);
            })
            .filter( x => !x);
    }

}
