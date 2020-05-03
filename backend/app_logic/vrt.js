var backstop = require('backstopjs');
var fs = require('fs');
var { promisify } = require('util');
var path = require('path');
const storage = new (require('../storage/storage-adapter'))
const engine = new (require('../engine-adapter'))
const { QueueWrapper } = require('./queue-wrappers')
const { SingleValueRule, BooleanValueRule, ArrayRule, SinceDateRule } =  require('../storage/query-rules')


const exists = promisify(fs.exists)
const copyFile = promisify(fs.copyFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const runQueue = new QueueWrapper(async (opts) => {

    const {runId, config, tenantId, userId} = opts
    await VRT
      .create({ tenantId:tenantId, user: userId })
      .processRun(runId, config)
})

const approveQueue = new QueueWrapper(async (opts) => {

    const {pair, tenantId, userId} = opts
    await VRT
      .create({ tenantId:tenantId, user: userId })
      .processApproveCase(pair)
})


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

    async processRun (runId, config) {

        const record = await storage.createHistoryRecord(this._userId, {
            state: 'Running',
            startedAt: new Date(),
            startedBy: this._userId,
            viewports: config.viewports.map( x => x.label),
            scenarios: config.scenarios.map( x => {
                return {
                    id: x._id.toString(),
                    label: x.label
                }
            }),
            runId
        })

        try {


            //await writeFile('./backstop-config.debug.json', JSON.stringify(config), 'utf-8')
            await backstop('test', { config: config } )

            console.log('[VRT] `backstop test` command completed')

            const report = await engine.getReport(config.paths.json_report)
            await this.createReport(runId, report)

            record.state = 'Passed';
            record.finishedAt = new Date();
            record.scenarios = record.scenarios.map( s => {

                let test = report.tests.find( t => t.pair.label === s.label)
                if (test) {
                    s.status = test.status;
                }
                else {
                    console.warn('Cannot find rest result for "'+s.label + '" in', report)
                }
                return s;
            });

            await storage.updateHistoryRecord(
              this._userId,
              record._id,
              storage.convertToObject(record))

            return runId
        }
        catch (err) {

            console.error('[VRT] Error:', err)
            const report = await engine.getReport(config.paths.json_report)
            await this.createReport(runId, report)

            record.state = 'Failed';
            record.finishedAt = new Date();
            record.scenarios = record.scenarios.map( s => {

                let test = report.tests.find( t => t.pair.label === s.label)
                if (test) {
                    s.status = test.status;
                }
                else {
                    console.warn('Cannot find rest result for "'+s.label + '" in', report)
                }
                return s;
            });


            await storage.updateHistoryRecord(
              this._userId,
              record._id,
              storage.convertToObject(record))

            return runId
        }
    }

    async processApproveCase (pair, cb) {

        const reference = path.join(__dirname, '..', pair.reference);
        const test = path.join(__dirname, '..', pair.test);

        const testFileExits = await exists(test)

        if (!testFileExits) {
            console.error('ERR: Cannot find TEST result', test);
            return {success:false, reason: 'Cannot find TEST result'};
        }

        await mkdir(path.dirname(reference), {recursive:true})
        await copyFile(test, reference)

        const date = new Date()
        const scenario = await storage.getScenarioByLabel(this._userId, pair.label)

        await storage.createHistoryRecord(this._userId, {
            state: 'Approved',
            startedAt: date,
            finishedAt: date,
            startedBy: this._userId,
            viewports: [ pair.viewportLabel ],
            scenarios: [{
                    id: scenario._id.toString(),
                    label: scenario.label
                }]
            })
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
          (viewports||[]).map(storage.convertToObject),
          scenarios);
    }


    /// API

    async enqueueRun (opts) {

        const runId = uuidv4()

        let config = await this.getConfig( opts.filter ? {label: opts.filter } : undefined )

        config.paths.json_report = path.join(
          config.paths.json_report,
          runId
        )

        await runQueue.push({
            runId,
            config,
            tenantId: this._tenantId,
            userId: this._userId
        })

        return { enqueuedSuccessfully: true }
    }
    async enqueueApproveCase (pair) {

        await approveQueue.push({
            pair,
            tenantId: this._tenantId,
            userId: this._userId
        })

        return { enqueuedSuccessfully: true }
    }

    async getReportByRunId (runId) {

        const report = await storage.getReportByRunId(this._userId, runId)
        const config = await this.getConfig();

        engine.convertReportPath(config.paths, runId, report)

        return report
    }

    /// filter: {state, startedBy, startedSince}
    async getHistoryRecords (filter, limit) {

        let query = {}

        if (filter) {

            const state = new SingleValueRule(filter.state, ['Passed', 'Failed'])
            const startedBy = new SingleValueRule(filter.startedBy, ['Run by me'])
            const viewports = new ArrayRule(filter.viewports)
            const startedSince = new SinceDateRule(filter.startedSince)

            if ( state.isValid() ) {
                query.state = state.toQueryPart();
            }

            if ( startedBy.isValid() ) {
                query.startedBy = this._userId;
            }

            if ( viewports.isValid() ) {
                query.viewports = viewports.toQueryPart()
            }

            if (startedSince.isValid() ) {
                query.startedAt = startedSince.toQueryPart();
            }
        }

        return await storage.getHistoryRecords(this._userId, query, limit)
    }
    async getHistoryRecordsOfScenario (scenarioId) {

        const query = {
            "scenarios.id" : scenarioId
        }

        let jobs = await storage.getHistoryRecords(this._userId, query)

        const cleanOtherScenarios = (job) => {
            job.scenarios = job.scenarios.filter( s => s.id === scenarioId);
            return job
        }

        let history = jobs
          .map(cleanOtherScenarios)
          .filter(j => j.scenarios.length > 0)
          .map(j => ({
                        id: j._id,
                        runId: j.runId,
                        startedAt: j.startedAt,
                        startedBy: j.startedBy,
                        state: j.scenarios[0].status
                    })
          )

        return history;
    }
    async deleteHistoryRecord (id) {
        return await storage.deleteHistoryRecord(this._userId, id)
    }
    async deleteAllHistoryRecords () {
        return await storage.deleteAllHistoryRecords(this._userId)
    }

    async getScenarioById (id) {
        return await storage.getScenarioById(this._userId, id)
    }
    async getScenarios (filter) {
        
        let query = {}
        
        if(filter) {
            const favorites = new BooleanValueRule(filter.favorites)

            if (favorites.isValid()) {
                query.meta_isFavorite = favorites.toQueryPart()
            }
        }

        return await storage.getScenarios(this._userId, query)
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
