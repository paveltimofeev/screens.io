const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readFile = promisify(fs.readFile)
const { UIError } = require('./ui-error');

const throwIfInvalidPathPart = (name, pathPart) => {

  if (
    !pathPart ||
    typeof(pathPart) !== 'string' ||
    pathPart.length === 0 ||
    pathPart === '' ||
    pathPart >= 0
  ) {
    throw new Error( `Invalid path part: "${name}" = "${pathPart}"`)
  }
}
const validateArray = (name, param) => {

  if (!param || param.length === 0) {
    UIError.throw(`No "${name}" found`, {name, param})
  }
}

class EngineAdapter {

    /* UNUSED? */
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

        throwIfInvalidPathPart('html_report', configPaths.html_report)
        throwIfInvalidPathPart('runId', runId)

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

        throwIfInvalidPathPart('tenantId', tenantId)
        throwIfInvalidPathPart('userId', userId)

        return {
            bitmaps_reference: `vrt_data/${tenantId}/${userId}/bitmaps_reference`,
            engine_scripts:    `app_logic/engine_scripts`,

            bitmaps_test: `vrt_data/${tenantId}/${userId}/bitmaps_test`,
            html_report:  `vrt_data/${tenantId}/${userId}/html_report`,
            ci_report:    `vrt_data/${tenantId}/${userId}/ci_report`,
            json_report:  `vrt_data/${tenantId}/${userId}/json_report`
        }
    }

    buildConfig (tenantId, userId, viewports, scenarios, custom) {

        if (!tenantId || tenantId === '') {
          throw new Error('buildConfigPaths: no tenantId')
        }

        if (!userId || userId === '') {
          throw new Error('buildConfigPaths: no userId')
        }

        validateArray('viewports', viewports)
        validateArray('scenarios', scenarios)

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

module.exports = EngineAdapter
