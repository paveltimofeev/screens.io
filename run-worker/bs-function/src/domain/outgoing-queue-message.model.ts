import { IReport } from './models';

export interface IOutgoingQueueMessage {

    report: IReport;
    runId: string;
    ctx: {
        tenant: string;
        userid: string;
        user: string;
    };

    isValid () : boolean;
}

export class OutgoingQueueMessage implements IOutgoingQueueMessage {

    readonly report: IReport;
    readonly runId: string;
    readonly ctx: { tenant: string; userid: string; user: string };

    constructor (_report: IReport, _runId: string, _ctx: { tenant: string; userid: string; user: string }) {

        this.report = _report;
        this.runId = _runId;
        this.ctx = _ctx;
    }

    isValid () : boolean {

        const notEmptyString = (value:string): boolean => {

            return value != null && value.length > 0;
        }

        return notEmptyString( this.runId) &&
            notEmptyString( this.ctx.tenant) &&
            notEmptyString( this.ctx.userid ) &&
            notEmptyString( this.ctx.user ) &&
            this.report != null;
    }
}
