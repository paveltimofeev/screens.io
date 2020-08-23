import { IReportReader, Report } from "../../domain/task-processor";


export class ReportReader implements IReportReader {
    
    async read(path: string): Promise<Report> {
        throw new Error("Method not implemented.");
    }

}
