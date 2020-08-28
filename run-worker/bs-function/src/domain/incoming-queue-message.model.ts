import { IConfig } from './models';

export interface IIncomingQueueMessage {

    messageId: string;

    tenantId: string;
    userId: string;
    runId: string;
    config: IConfig;

    ctx?: {
        tenant: string;
        userid: string;
    }
}
