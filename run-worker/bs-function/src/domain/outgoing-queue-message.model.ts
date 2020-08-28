import { IReport } from './models';

export interface IOutgoingQueueMessage {

    report: IReport;
    runId: string;
    ctx: {
        tenant: string;
        userid: string;
    };

    isValid () : boolean;
}

export class OutgoingQueueMessage implements IOutgoingQueueMessage {

    readonly report: IReport;
    readonly runId: string;
    readonly ctx: { tenant: string; userid: string };

    constructor (_report: IReport, _runId: string, _tenant: string, _userid: string) {

        this.report = _report;
        this.runId = _runId;
        this.ctx = {
            tenant: _tenant,
            userid: _userid
        }
    }

    isValid () : boolean {

        const notEmptyString = (value:string): boolean => {

            return value != null && value.length > 0;
        }

        return notEmptyString( this.runId) &&
            notEmptyString( this.ctx.tenant) &&
            notEmptyString( this.ctx.userid ) &&
            this.report != null;
    }
}
