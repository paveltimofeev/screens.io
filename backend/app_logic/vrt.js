var backstop = require('backstopjs');
var fs = require('fs');
var { promisify } = require('util');
var path = require('path');
const storage = new (require('../storage-adapter'))
const engine = new (require('../engine-adapter'))

const exists = promisify(fs.exists)
const copyFile = promisify(fs.copyFile)
const mkdir = promisify(fs.mkdir)

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class VRT {

    constructor(tenantId, userId) {

        this._tenantId = tenantId;
        this._userId = userId;
    }

    static create (ctx) {

        if (!ctx.user) {
            console.error('No user in request context')
            var err = new Error('Bad request')
            err.status = 400
            throw err;
        }

        return new VRT('test-tenant', ctx.user)
    }


    /// LAMBDA

    async run (opts) {

        const runId = uuidv4()

        let config = await this.getConfig( opts.filter ? {label: opts.filter } : undefined )

        config.paths.json_report = path.join(
          config.paths.json_report,
          runId
        )

        const record = await storage.createHistoryRecord(this._userId, {
            state: 'Running',
            startedAt: new Date(),
            scenarios: config.scenarios.map( x => x.label),
            runId
        })

        try {

            await backstop('test', { config: config } )

            console.log('[VRT] `backstop test` command completed')

            const report = await engine.getReport(config.paths.json_report)
            await this.createReport(runId, report)
            await storage.updateHistoryRecord(this._userId, record._id, { state: 'Passed' })
            return runId
        }
        catch (err) {

            console.error('[VRT] Error:', err)
            const report = await engine.getReport(config.paths.json_report)
            await this.createReport(runId, report)
            await storage.updateHistoryRecord(this._userId, record._id, { state: 'Failed' })
            return runId
        }
    }

    async approveCase (pair, cb) {

        const reference = path.join(__dirname, '..', pair.reference);
        const test = path.join(__dirname, '..', pair.test);

        const testFileExits = await exists(test)

        if (!testFileExits) {
            console.error('ERR: Cannot find TEST result', test);
            return {success:false, reason: 'Cannot find TEST result'};
        }

        await mkdir(path.dirname(reference), {recursive:true})
        const result = await copyFile(test, reference)
        console.log('success:', result);
        return {success:true}
    }

    stop (cb) {

        backstop( 'stop' )
          .then( (r) => { console.log('[VRT] stop done', r); cb(null, r); })
          .catch( (e) => { console.log('[VRT] stop failed', e); cb(e);});
    }

    async createReport (runId, data) {

        data.runId = runId;
        return await storage.createReport(this._userId, data )
    }


    /// shared
    async getConfig( scenariosFilter ) {

        const viewports = await storage.getViewports(this._userId)
        const scenarios = await storage.getScenarios(this._userId, scenariosFilter )

        return engine.buildConfig(this._tenantId, this._userId,
          storage.convertToObject(viewports),
          storage.convertToObject(scenarios));
    }


    /// API

    async getReportByRunId (runId) {

        const report = await storage.getReportByRunId(this._userId, runId)
        const config = await this.getConfig();

        engine.convertReportPath(config.paths, runId, report)

        return report
    }

    async getHistoryRecords () {
        return await storage.getHistoryRecords(this._userId, this._userId)
    }
    async deleteHistoryRecord (id) {
        return await storage.deleteHistoryRecord(this._userId, id)
    }

    async getScenarioById (id) {
        return await storage.getScenarioById(this._userId, id)
    }
    async getScenarios () {
        return await storage.getScenarios(this._userId)
    }
    async createScenario (data) {
        return await storage.createScenario(this._userId, data)
    }
    async cloneScenario (id, data) {
        return await storage.cloneScenario(this._userId, id, data)
    }
    async addScenarioToFavorites (id) {
        await storage.updateScenario(this._userId, id, {meta_isFavorite: true})
    }
    async removeScenarioFromFavorites (id) {
        await storage.updateScenario(this._userId, id, {meta_isFavorite: false})
    }
    async updateScenario (id, data) {
        return await storage.updateScenario(this._userId, id, data)
    }
    async deleteScenario (id) {
        return await storage.deleteScenario(this._userId, id)
    }

    async getViewportById (id) {
        return await storage.getViewportById(this._userId, id)
    }
    async getViewports () {
        return await storage.getViewports(this._userId)
    }
    async createViewport (data) {
        return await storage.createViewport(this._userId, data)
    }
    async updateViewport (id, data) {
        return await storage.updateViewport(this._userId, id, data)
    }
    async deleteViewport (id) {
        return await storage.deleteViewport(this._userId, id)
    }
}

module.exports = VRT;
