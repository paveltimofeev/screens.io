const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const appUtils = require('./app-utils');
const readFile = promisify(fs.readFile);

const filePathsService = new appUtils.FilePathsService();


class EngineAdapter {

    async getReport (reportFolder) {

        try {
            const data = await readFile(path.join(reportFolder, 'jsonReport.json'), 'utf8')
            return JSON.parse(data)
        }
        catch (error ) {
            console.error('[EngineAdapter] ERROR getReport', error)
            throw error;
        }
    }

    convertReportPath (configPaths, runId, report) {

        if (!report) {
            return
        }

        appUtils.throwIfInvalidPathPart('html_report', configPaths.html_report)
        appUtils.throwIfInvalidPathPart('runId', runId)

        report.tests.forEach( t => {

            t.pair.reference = '\\' + path.join( configPaths.html_report, runId, t.pair.reference );
            t.pair.test = '\\' + path.join( configPaths.html_report, runId, t.pair.test );

            if (t.pair.diffImage) {
                t.pair.diffImage = '\\' + path.join( configPaths.html_report, runId, t.pair.diffImage )
            }
        });

        return report;
    }

    buildConfigPaths (tenantId, userId) {

        appUtils.throwIfInvalidPathPart('tenantId', tenantId)
        appUtils.throwIfInvalidPathPart('userId', userId)

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

    buildConfig (tenantId, userId, viewports, scenarios, custom) {

        if (!tenantId || tenantId === '') {
          throw new Error('buildConfigPaths: no tenantId')
        }

        if (!userId || userId === '') {
          throw new Error('buildConfigPaths: no userId')
        }

        appUtils.validateArray('viewports', viewports)
        appUtils.validateArray('scenarios', scenarios)

        const removeEmptyArraysInObject = (obj, propName) => {

            if (obj[propName] && obj[propName].length === 0) {
                delete obj[propName]
            }
        }

        scenarios = scenarios.map(s => {

            let scenario = JSON.parse(JSON.stringify(s))
            delete scenario.__v;

            removeEmptyArraysInObject(scenario, 'clickSelectors')
            removeEmptyArraysInObject(scenario, 'hoverSelectors')
            removeEmptyArraysInObject(scenario, 'keyPressSelectors')

            return scenario
        })

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
        }

        var result = {
            id: tenantId,
            viewports: viewports,
            scenarios: scenarios,
            ...custom || {},
            ...base
        }

        result.paths = this.buildConfigPaths(tenantId, userId);

        return result;
    }
}


class JsonReportAdapter {

    constructor (jsonReport, reportLocation, runId) {

        this._reportLocation = reportLocation;
        this._report = this._convertReport(jsonReport, runId);
    }

    _convertReport(jsonReport, runId) {

        jsonReport.runId = runId;

        const getAbsolutePath = (value) => {

            return value ? path.join( this._reportLocation, value ) : null
        };

        if (!jsonReport.tests) {
            jsonReport.tests = [];
        }

        jsonReport.tests.forEach(test => {

            let absolute = {
                ref: getAbsolutePath( test.pair.reference ),
                test: getAbsolutePath( test.pair.test ),
                diff: getAbsolutePath( test.pair.diffImage ),
            };

            test.pair.images = {
                absolute,
                relative : {
                    ref : filePathsService.relativeToVrtDataPath( absolute.ref ),
                    test : filePathsService.relativeToVrtDataPath( absolute.test ),
                    diff : filePathsService.relativeToVrtDataPath( absolute.diff ),
                }
            };

            test.pair.reference = !test.pair.reference ? null : filePathsService.relativeToVrtDataPath(  path.resolve(this._reportLocation, test.pair.reference) );
            test.pair.test      = !test.pair.test ? null : filePathsService.relativeToVrtDataPath(  path.resolve(this._reportLocation, test.pair.test) );
            test.pair.diffImage = !test.pair.diffImage ? null : filePathsService.relativeToVrtDataPath(  path.resolve(this._reportLocation, test.pair.diffImage) );
        });

        return jsonReport;
    }

    get report() {
        return this._report;
    }
}


module.exports = {
    EngineAdapter: EngineAdapter,
    JsonReportAdapter: JsonReportAdapter
}
