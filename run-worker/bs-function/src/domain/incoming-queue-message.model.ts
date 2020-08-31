import { IConfig } from './models';

export interface IIncomingQueueMessage {

    config: IConfig;

    messageId: string;
    runId: string;
    ctx: {
        tenant: string;
        userid: string;
        user: string;
    }
}
