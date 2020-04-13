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
}

module.exports = EngineAdapter
