import { IIncomingQueueMessage } from './models';


export class QueueMessageAdapter {

    static fromLambdaEvent (event:any): IIncomingQueueMessage {
        console.log('[QueueMessageAdapter] fromLambdaEvent: convert event to IIncomingQueueMessage');

        if (!event.tenantId) { throw new Error('Incoming event should have "tenantId" property'); }
        if (!event.userId)   { throw new Error('Incoming event should have "userId" property'); }
        if (!event.runId)    { throw new Error('Incoming event should have "runId" property'); }
        if (!event.config)   { throw new Error('Incoming event should have "config" property'); }

        return {
            tenantId: event.tenantId,
            userId: event.userId,
            runId: event.runId,
            config: event.config
        };
    }
}
