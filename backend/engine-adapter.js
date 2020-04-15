const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readFile = promisify(fs.readFile)


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

        report.tests.forEach( t => {

            t.pair.reference = '\\' + path.join( configPaths.html_report, runId, t.pair.reference );
            t.pair.test = '\\' + path.join( configPaths.html_report, runId, t.pair.test );

            if (t.pair.diffImage) {
                t.pair.diffImage = '\\' + path.join( configPaths.html_report, runId, t.pair.diffImage )
            }
        });

        return report;
    }

    buildConfig (tenantId, userId, viewports, scenarios, custom) {

        var base = {
            onBeforeScript: "",
            onReadyScript: "",
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

        result.paths = {

            bitmaps_reference: `vrt_data/${tenantId}/${userId}/bitmaps_reference`,
            engine_scripts:    `vrt_data/${tenantId}/${userId}/engine_scripts`,

            bitmaps_test: `vrt_data/${tenantId}/${userId}/bitmaps_test`,
            html_report:  `vrt_data/${tenantId}/${userId}/html_report`,
            ci_report:    `vrt_data/${tenantId}/${userId}/ci_report`,
            json_report:  `vrt_data/${tenantId}/${userId}/json_report`
        };

        return result;
    }
}

module.exports = EngineAdapter
