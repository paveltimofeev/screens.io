import { IConfig, IJsonReport, IJsonReportTestCase, IReport, IScenario, IViewport } from './models';
import { FilePathsService } from './file-paths-service';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readFile = promisify(fs.readFile);

const filePathsService = new FilePathsService();


const throwIfInvalidPathPart = (name:string, pathPart:any) => {

  if (
    !pathPart ||
    typeof(pathPart) !== 'string' ||
    pathPart.length === 0 ||
    pathPart === ''
  ) {
    throw new Error( `Invalid path part: "${name}" = "${pathPart}"`)
  }
}
const validateArray = (name:string, param:any) => {

  if (!param || param.length === 0) {
    throw new Error(`No "${name}" found. param=${ param }`)
  }
}


export class EngineAdapter {

    async getReport (reportFolder:string): Promise<IJsonReport> {

        try {
            const data = await readFile(path.join(reportFolder, 'jsonReport.json'), 'utf8');
            return JSON.parse(data) as IJsonReport
        }
        catch (error ) {
            console.error('[EngineAdapter] ERROR getReport', error);
            throw error;
        }
    }

    convertReportPath (config: IConfig, runId:string, report:any) {

        const configPaths = config.paths;

        if (!report) {
            return
        }

        throwIfInvalidPathPart('html_report', configPaths.html_report);
        throwIfInvalidPathPart('runId', runId);

        report.tests.forEach( (t:any) => {

            t.pair.reference = '\\' + path.join( configPaths.html_report, runId, t.pair.reference );
            t.pair.test = '\\' + path.join( configPaths.html_report, runId, t.pair.test );

            if (t.pair.diffImage) {
                t.pair.diffImage = '\\' + path.join( configPaths.html_report, runId, t.pair.diffImage )
            }
        });

        return report;
    }

    buildConfigPaths (tenantId: string, userId: string) {

        throwIfInvalidPathPart('tenantId', tenantId);
        throwIfInvalidPathPart('userId', userId);

        const vrtDataLocation = filePathsService.vrtDataFullPath();

        return {
            bitmaps_reference: `${vrtDataLocation}/${tenantId}/${userId}/bitmaps_reference`,
            engine_scripts:    `app_logic/engine_scripts`,

            bitmaps_test: `${vrtDataLocation}/${tenantId}/${userId}/bitmaps_test`,
            html_report:  `${vrtDataLocation}/${tenantId}/${userId}/html_report`,
            ci_report:    `${vrtDataLocation}/${tenantId}/${userId}/ci_report`,
            json_report:  `${vrtDataLocation}/${tenantId}/${userId}/json_report`
        }
    }

    buildConfig (tenantId:string, userId:string, viewports:IViewport[], scenarios:IScenario[], custom:any) {

        if (!tenantId || tenantId === '') {
          throw new Error('buildConfigPaths: no tenantId')
        }

        if (!userId || userId === '') {
          throw new Error('buildConfigPaths: no userId')
        }

        validateArray('viewports', viewports);
        validateArray('scenarios', scenarios);

        const removeEmptyArraysInObject = (obj:any, propName:string) => {

            if (obj[propName] && obj[propName].length === 0) {
                delete obj[propName]
            }
        };

        scenarios = scenarios.map(s => {

            let scenario = JSON.parse(JSON.stringify(s));
            delete scenario.__v;

            removeEmptyArraysInObject(scenario, 'clickSelectors');
            removeEmptyArraysInObject(scenario, 'hoverSelectors');
            removeEmptyArraysInObject(scenario, 'keyPressSelectors');

            return scenario
        });

        var base = {
            onBeforeScript: "puppet/onBefore.js",
            onReadyScript: "puppet/onReady.js",
            report: [
                "CI",
                "json"
            ],
            engine: "puppeteer",
            engineOptions: {
                args: [
                  "--no-sandbox"
                ]
            },
            asyncCaptureLimit: 5,
            asyncCompareLimit: 50,
            debug: false,
            debugWindow: false
        };

        var result = {
            id: tenantId,
            viewports: viewports,
            scenarios: scenarios,
            ...custom || {},
            ...base
        };

        result.paths = this.buildConfigPaths(tenantId, userId);

        return result;
    }
}


export class JsonReportAdapter {

    reportLocation:string;
    _report: IReport;

    get report() : IReport {
        return this._report;
    }


    constructor (jsonReport: IJsonReport, reportLocation:string, runId:string) {

        this.reportLocation = reportLocation;
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
                    ref : filePathsService.relativeToVrtDataPath( absolute.ref ),
                    test : filePathsService.relativeToVrtDataPath( absolute.test ),
                    diff : filePathsService.relativeToVrtDataPath( absolute.diff ),
                }
            };

            test.pair.reference = !test.pair.reference ? null : filePathsService.relativeToVrtDataPath(  path.resolve(this.reportLocation, test.pair.reference) );
            test.pair.test      = !test.pair.test ? null : filePathsService.relativeToVrtDataPath(  path.resolve(this.reportLocation, test.pair.test) );
            test.pair.diffImage = !test.pair.diffImage ? null : filePathsService.relativeToVrtDataPath(  path.resolve(this.reportLocation, test.pair.diffImage) );
        });

        return jsonReport;
    }

    private getAbsolutePath (value:string) {

        return value ? path.join( this.reportLocation, value ) : null
    }
}
