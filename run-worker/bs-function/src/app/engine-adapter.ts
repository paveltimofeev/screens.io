import { IConfig, IJsonReport, IScenario, IViewport } from '../domain/models';
import { FilePathsService } from './file-paths-service';
import { throwIfInvalidPathPart, validateArray } from '../infrastructure/utils';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readFile = promisify(fs.readFile);


export class EngineAdapter {

    filePathsService: FilePathsService;

    constructor (filePathsService: FilePathsService) {
        this.filePathsService = filePathsService;
    }

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

    convertReportPath (config: IConfig, runId:string, report:any): IConfig {

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

        const vrtDataLocation = this.filePathsService.vrtDataFullPath();

        return {
            bitmaps_reference: `${vrtDataLocation}/${tenantId}/${userId}/bitmaps_reference`,
            engine_scripts:    `engine_scripts`,

            bitmaps_test: `${vrtDataLocation}/${tenantId}/${userId}/bitmaps_test`,
            html_report:  `${vrtDataLocation}/${tenantId}/${userId}/html_report`,
            ci_report:    `${vrtDataLocation}/${tenantId}/${userId}/ci_report`,
            json_report:  `${vrtDataLocation}/${tenantId}/${userId}/json_report`
        }
    }

    buildConfig (tenantId:string, userId:string, viewports:IViewport[], scenarios:IScenario[], custom:any): IConfig {

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
