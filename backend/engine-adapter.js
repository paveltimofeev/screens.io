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
}

module.exports = EngineAdapter
