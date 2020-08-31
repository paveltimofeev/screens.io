var path = require('path');
const storage = new (require('../modules/storage/storage-adapter'));
const { EngineAdapter } = require('../modules/engine/engine-adapter');
const queues = require('./queue-wrappers');
const rules =  require('../modules/storage/query-rules');
const appUtils = require('../modules/infrastructure/app-utils');

const engine = new EngineAdapter();

const config = require('../modules/infrastructure/configuration');
const { QueueAdapter } = require('../modules/aws/queue-adapter');
const tasksQueue = new QueueAdapter(config.taskQueueUrl);

class VRT {

    constructor(tenant, dbName, userid, user) {

        if ( !tenant ) {
            throw new Error('ERROR: No tenant Id', tenant)
        }
        if ( !dbName ) {
            throw new Error('ERROR: No db Name', dbName)
        }
        if ( !userid ) {
            throw new Error('ERROR: No user Id', userid)
        }
        if ( !user ) {
            throw new Error('ERROR: No user', user)
        }
        if ( typeof(dbName) !== 'string' || dbName.length <= 0 || dbName.indexOf(' ') >= 0 ) {
            throw new Error('Wrong db Name:', dbName);
        }

        this._db = dbName;
        this._tenantId = tenant;
        this._userId = userid;
        this._user = user;

        console.log('[VRT] Create VRT', `tenant: ${tenant}; dbName: ${dbName}; userid: ${userid}`)
    }

    static create (ctx) {

        const validateParams = (name) => {

            if (!ctx[name]) {

                console.error(`No ${name} in request context`, ctx)
                var err = new Error('Bad request. Not valid context.')
                err.status = 400
                throw err;
            }
        }

        validateParams('user');
        validateParams('tenant');
        validateParams('userid');
        validateParams('user');

        return new VRT(ctx.tenant, ctx.userid, ctx.userid, ctx.user)
    }

    async getConfig( scenariosQuery, viewportsQuery ) {

        const viewports = await storage.getViewports(this._db, viewportsQuery || { enabled:true })
        const scenarios = await storage.getScenarios(this._db, scenariosQuery )

        return engine.buildConfig(
          this._tenantId,
          this._userId,
          (viewports||[]).map(storage.convertToObject),
          scenarios
        );
    }


    async initializeUser () {

        await storage.createViewport(this._db,
            {label: '1920 × 1080', width: 1920, height: 1080, enabled: true})

        await storage.createViewport(this._db,
            {label: '1600 × 900', width: 1600, height: 900, enabled: false})

        await storage.createViewport(this._db,
            {label: '1536 × 864' , width: 1536, height: 864, enabled: false})
    }

    async enqueueRun (opts) {

        const runId = appUtils.uuidv4()

        let scenariosQuery
        let viewportsQuery

        if ( opts.scenarios
          && Array.isArray(opts.scenarios)
          && opts.scenarios.every( x => typeof(x) === 'string' )
        ){
            scenariosQuery = { label: {$in: opts.scenarios }};
        }

        if ( opts.viewports
          && Array.isArray(opts.viewports)
          && opts.viewports.every( x => typeof(x) === 'string' )
        ){
            viewportsQuery = {
                $and: [
                    { enabled:true },
                    { label: { $in: opts.viewports }}
                ]
            }
        }

        console.log('viewportsQuery', viewportsQuery);
        let config = await this.getConfig( scenariosQuery, viewportsQuery )

        config.paths.json_report = path.join(
          config.paths.json_report,
          runId
        );

        const historyRecord = {
            state: 'Running',
            startedAt: new Date(),
            startedBy: this._user,
            viewports: config.viewports.map( x => x.label),
            scenarios: config.scenarios.map( x => {
                return {
                    id: x._id.toString(),
                    label: x.label
                }
            }),
            runId
        };
        await this.createHistoryRecord(historyRecord);

        const task = {
            runId,
            config,
            ctx: {
                user:   this._user,
                tenant: this._tenantId,
                userid: this._userId
            }
        };
        await tasksQueue.push(task);

        return {
            enqueuedSuccessfully: true,
            scenariosCount: config.scenarios.length,
            viewportsCount: config.viewports.length
        }
    }
    async enqueueApproveCase (testCase) {

        let report = await storage.getReportById(this._db, testCase.reportId);

        const isPairExists = () => {
            return report && report.tests && report.tests.length > testCase.testCaseIndex;
        }

        if ( isPairExists() ) {

            await queues.sendToApproveQueue({
                data: testCase,
                ctx: {
                    tenant: this._tenantId,
                    userid: this._userId,
                    user:   this._user
                }
            });

            return { enqueuedSuccessfully : true }
        }
        else {
            return { enqueuedSuccessfully : false }
        }
    }

    async getReportByRunId (runId) {

        return await storage.getReportByRunId(this._db, runId)
    }

    /// filter: {state, startedBy, startedSince}
    async getHistoryRecords (filter, limit) {

        let query = {};

        if (filter) {

            const state = new rules.SingleValueRule(filter.state, ['Passed', 'Failed', 'Running', 'Approved'])
            const not_state = new rules.SingleValueRule(filter.not_state, ['Passed', 'Failed', 'Running', 'Approved'])
            const startedBy = new rules.SingleValueRule(filter.startedBy, ['Run by me'])
            const viewports = new rules.ArrayRule(filter.viewports)
            const startedSince = new rules.SinceDateRule(filter.startedSince)
            const beforeStartedAt = new rules.BeforeDateRule(filter.beforeStartedAt)

            if ( state.isValid() ) {
                query.state = state.toQueryPart();
            }

            if ( not_state.isValid() ) {
                query.state = { '$ne': not_state.toQueryPart() };
            }

            if ( startedBy.isValid() ) {
                query.startedBy = this._db;
            }

            if ( viewports.isValid() ) {
                query.viewports = viewports.toQueryPart()
            }

            if (startedSince.isValid() ) {
                query.startedAt = startedSince.toQueryPart();
            }

            if (beforeStartedAt.isValid() ) {
                query.startedAt = beforeStartedAt.toQueryPart();
            }
        }

        return await storage.getHistoryRecords(this._db, query, limit)
    }
    async getRecentlyFailedJob() {

        const records = await this.getHistoryRecords( {state: 'Failed'}, 1);

        if (!records || records.length < 1 || !records[0].scenarios) {
            return null;
        }

        return {
            jobId: records[0]._id,
            scenarios: records[0].scenarios.map(x => x.label)
        };
    }
    async getHistoryRecordsCount () {

        const stats = await storage.getHistoryRecordsStats(this._db)
        return stats.count
    }
    async getHistoryRecordById (id) {
        return await storage.getHistoryRecordById(this._db, id)
    }
    async getHistoryRecordsOfScenario (scenarioId) {

        const query = {
            "scenarios.id" : scenarioId
        }

        let jobs = await storage.getHistoryRecords(this._db, query, 10)

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
                        state: j.scenarios[0].status || j.state
                    })
          )

        return history;
    }
    async createHistoryRecord (data) {

        await storage.createHistoryRecord(this._db, data);
    }
    async deleteHistoryRecord (id) {
        return await storage.deleteHistoryRecord(this._db, id)
    }
    async deleteAllHistoryRecords () {
        return await storage.deleteAllHistoryRecords(this._db)
    }

    async getScenarioById (id) {
        return await storage.getScenarioById(this._db, id)
    }
    async getScenarios (filter) {

        let query = {}

        if(filter) {
            const favorites = new rules.BooleanValueRule(filter.favorites)

            if (favorites.isValid()) {
                query.meta_isFavorite = favorites.toQueryPart()
            }
        }

        return await storage.getScenarios(this._db, query)
    }
    async createScenario (data) {

        appUtils.validateScenario(data);
        return await storage.createScenario(this._db, data)
    }
    async cloneScenario (id, data) {
        return await storage.cloneScenario(this._db, id, data)
    }
    async addScenarioToFavorites (id) {
        await storage.updateScenario(this._db, id, {meta_isFavorite: true})
    }
    async switchScenarioFavorite (id) {

        let scenario = await storage.getScenarioById(this._db, id)
        await storage.updateScenario(this._db, id, {meta_isFavorite: !(scenario.meta_isFavorite || false)})
    }
    async removeScenarioFromFavorites (id) {
        await storage.updateScenario(this._db, id, {meta_isFavorite: false})
    }
    async updateScenario (id, data) {

        appUtils.validateScenario(data);
        return await storage.updateScenario(this._db, id, data)
    }
    async deleteScenario (id) {
        return await storage.deleteScenario(this._db, id)
    }

    async getViewportById (id) {
        return await storage.getViewportById(this._db, id)
    }
    async getViewports (query) {
        return await storage.getViewports(this._db, query)
    }
    async upsertViewports (viewports) {

        if (!viewports || !Array.isArray(viewports)) {
            console.log('Wrong viewports format', viewports)
            return { status: 400, error: 'Wrong viewports format'}
        }

        if (!viewports.every(x =>
          Number.isInteger(x.width) &&
          Number.isInteger(x.height) &&
          x.width >= 640 && x.height >= 480 &&
          x.width <= 4096 && x.height <= 3072 // max 4k
        )) {
            console.log('Unsupported viewport size. Min allowed 640 × 480, max 4096 × 3072.', viewports)
            return { status: 400, error: 'Unsupported viewport size. Min allowed 320 × 280, max 4096 × 3072.'}
        }

        return await storage.bulkWriteViewports(this._db, viewports, true)
    }
    async createViewport (data) {
        return await storage.createViewport(this._db, data)
    }
    async updateViewport (id, data) {
        return await storage.updateViewport(this._db, id, data)
    }
    async deleteViewport (id) {
        return await storage.deleteViewport(this._db, id)
    }
}

module.exports = VRT;
