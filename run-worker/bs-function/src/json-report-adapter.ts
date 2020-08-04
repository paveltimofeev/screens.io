import { IJsonReport, IJsonReportTestCase, IReport } from './models';
import { FilePathsService } from './file-paths-service';
const path = require('path');


export class JsonReportAdapter {

    reportLocation:string;
    _report: IReport;
    filePathsService:FilePathsService;

    get report() : IReport {
        return this._report;
    }


    constructor (jsonReport: IJsonReport, reportLocation:string, runId:string, filePathsService:FilePathsService) {

        this.reportLocation = reportLocation;
        this.filePathsService = filePathsService;
        this._report = this.convertReport(jsonReport, runId);
    }

    private convertReport (jsonReport: IReport, runId: string): IReport {

        jsonReport.runId = runId;

        if (!jsonReport.tests) {
            jsonReport.tests = [];
        }

        jsonReport.tests.forEach( (test:IJsonReportTestCase) => {

            let absolute = {
                ref: this.getAbsolutePath( test.pair.reference ),
                test: this.getAbsolutePath( test.pair.test ),
                diff: this.getAbsolutePath( test.pair.diffImage ),
            };

            test.pair.images = {
                absolute,
                relative : {
                    ref : this.filePathsService.relativeToVrtDataPath( absolute.ref ),
                    test : this.filePathsService.relativeToVrtDataPath( absolute.test ),
                    diff : this.filePathsService.relativeToVrtDataPath( absolute.diff ),
                }
            };

            test.pair.reference = !test.pair.reference ? null : this.filePathsService.relativeToVrtDataPath(  path.resolve(this.reportLocation, test.pair.reference) );
            test.pair.test      = !test.pair.test ? null : this.filePathsService.relativeToVrtDataPath(  path.resolve(this.reportLocation, test.pair.test) );
            test.pair.diffImage = !test.pair.diffImage ? null : this.filePathsService.relativeToVrtDataPath(  path.resolve(this.reportLocation, test.pair.diffImage) );
        });

        return jsonReport;
    }

    private getAbsolutePath (value:string): string {

        return value ? path.join( this.reportLocation, value ) : null
    }
}
