import { IReportReader, Report } from "../../domain/task-processor";
import { IJsonReport } from '../../domain/models';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readFile = promisify(fs.readFile);


export class ReportReader implements IReportReader {

    async read(folder: string): Promise<Report> {

        const reportPath = path.join(folder, 'jsonReport.json');

        const jsonReport = await this.getReport(reportPath);
        const resultFiles = jsonReport.tests
            .map( x => {
                return [
                    path.resolve(path.join(folder, x.pair.test)),
                    x.pair.diffImage ?
                        path.resolve(path.join(folder, x.pair.diffImage)):
                        undefined
                ];
            });

        let report = new Report();
        report.jsonReport = jsonReport;
        report.resultFiles = resultFiles.reduce( (a,b) => a.concat(b) ).filter(Boolean); // flat & skip empty

        return report;
    }

    async getReport (reportPath:string): Promise<IJsonReport> {

        try {
            const data = await readFile(reportPath, 'utf8');
            return JSON.parse(data) as IJsonReport
        }
        catch (error ) {
            console.error('[EngineAdapter] ERROR getReport', error);
            throw error;
        }
    }
}
