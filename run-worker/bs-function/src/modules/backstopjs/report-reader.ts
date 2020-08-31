import { IReportReader, Report, IJsonReport, ILogger } from '../../domain/models';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readFile = promisify(fs.readFile);


export class ReportReader implements IReportReader {

    constructor (
        private readonly _logger: ILogger
    ){}

    async read(folder: string): Promise<Report> {

        this._logger.log('read from', folder);

        const reportPath = path.join(folder, 'jsonReport.json');

        const jsonReport = await this.getReport(reportPath);

        let resultFiles:string[] = [];

        jsonReport.tests
            .forEach(x => {

                x.pair.test = path.relative(path.join(folder, '..', '..', '..', '..'), path.join(folder, x.pair.test) );
                x.pair.meta_testLG = x.pair.test;
                resultFiles.push( path.resolve(path.join(folder, x.pair.test)) );

                if (x.pair.diffImage) {

                    x.pair.diffImage = path.relative(path.join(folder, '..', '..', '..', '..'), path.join(folder, x.pair.diffImage) );
                    x.pair.meta_diffImageLG = x.pair.diffImage;
                    resultFiles.push( path.resolve(path.join(folder, x.pair.diffImage)) );
                }
            });

        let report = new Report();
        report.jsonReport = jsonReport;
        report.files = resultFiles
            .map( x => {
                    return {
                        localPath: x,
                        keyPath: path.relative(path.join(folder, '..', '..'), x)
                    }
            });

        this._logger.log('return files count', resultFiles.length);

        return report;
    }

    async getReport (reportPath:string): Promise<IJsonReport> {

        this._logger.log('getReport', reportPath);

        try {
            const data = await readFile(reportPath, 'utf8');
            return JSON.parse(data) as IJsonReport
        }
        catch (error ) {
            this._logger.error('[EngineAdapter] ERROR getReport', error);
            throw error;
        }
    }
}
