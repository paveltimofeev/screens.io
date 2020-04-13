const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readFile = promisify(fs.readFile)


class EngineAdapter {

    async getReport (reportFolder) {

        return await readFile(path.join(reportFolder, 'jsonReport.json'), 'utf8')
    }
}

module.exports = EngineAdapter
