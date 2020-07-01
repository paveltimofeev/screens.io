var backstop = require('backstopjs');
var fs = require('fs');
var { promisify } = require('util');
var path = require('path');
const storage = new (require('../storage/storage-adapter'))
const engine = new (require('../engine-adapter'))
const { QueueWrapper } = require('./queue-wrappers')
const { SingleValueRule, BooleanValueRule, ArrayRule, SinceDateRule, BeforeDateRule } =  require('../storage/query-rules')


const exists = promisify(fs.exists)
const copyFile = promisify(fs.copyFile)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

function uniqueOnly (value, index, self) {
    return self.findIndex(x => {
        return x.label === value.label && x.status === value.status
    }) === index;
}

function skipPassedIfHasFailed (value, index, self) {
    let found = self.findIndex(x => {
        return x.label === value.label && x.status === 'Failed'
    })
    return  found  === index || found === -1;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const runQueue = new QueueWrapper(async (opts) => {

    const {runId, config} = opts

    const ctx = {
        tenant: opts.tenant,
        user: opts.user,
        userid: opts.userid
    }

    await VRT.create(ctx).processRun(runId, config)
})

const approveQueue = new QueueWrapper(async (opts) => {

    const {pair} = opts

    const ctx = {
        tenant: opts.tenant,
        user: opts.user,
        userid: opts.userid
    }

    await VRT.create(ctx).processApproveCase(pair)
})

const validateScenario = (data) => {

    const allowStringArraysOnly = (scenario, prop) => {
        if(
          !Array.isArray( scenario[ prop ] ) ||
          scenario[ prop ] == null ||
          (typeof (scenario[ prop ]) === 'string' && scenario[ prop ].trim() === '') )
        {
            scenario[ prop ] = []
        }

        scenario[ prop ] = scenario[ prop ].filter( x => typeof (x) === 'string' && x.trim() !== '' && x !== '' )
    };

    allowStringArraysOnly(data, 'hideSelectors');
    allowStringArraysOnly(data, 'removeSelectors');
    allowStringArraysOnly(data, 'clickSelectors');
    allowStringArraysOnly(data, 'hoverSelectors');
    allowStringArraysOnly(data, 'selectors');
}

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

        console.log('Create VRT', {tenant, dbName, userid})
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


    /// LAMBDA

    async updateScenariosRunStatus (scenarios) {

        await scenarios
          .filter(uniqueOnly)
          .filter(skipPassedIfHasFailed)
          .forEach(async scenario => {

              console.log('[VRT] updateScenariosRunStatus', scenario.label, scenario.status)

              await storage.updateScenarioByLabel(
                this._db,
                scenario.label,
                { meta_recentRunStatus: scenario.status }
              )

          })
    }

    async processRun (runId, config) {

        const record = await storage.createHistoryRecord(this._db, {
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
                    console.warn('Cannot find test result for "'+s.label + '" in', report)
                }
                return s;
            });

            await this.updateScenariosRunStatus(record.scenarios)
            await storage.updateHistoryRecord(
              this._db,
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

            await this.updateScenariosRunStatus(record.scenarios)
            await storage.updateHistoryRecord(
              this._db,
              record._id,
              storage.convertToObject(record))

            return runId
        }
    }

    async processApproveCase (pair) {

        const reference = path.join(__dirname, '..', pair.reference);
        const test = path.join(__dirname, '..', pair.test);

        const testFileExits = await exists(test)

        if (!testFileExits) {
            console.error('ERR: Cannot find TEST result at', test);
            return {success:false, reason: 'Cannot find TEST result'};
        }

        await mkdir(path.dirname(reference), {recursive:true})
        await copyFile(test, reference)

        const date = new Date()
        const scenario = await storage.getScenarioByLabel(this._db, pair.label)

        await storage.updateScenario(this._db, scenario._id, {
            meta_referenceImageUrl: pair.reference
        });

        await storage.createHistoryRecord(this._db, {
            state: 'Approved',
            startedAt: date,
            finishedAt: date,
            startedBy: this._user,
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
        return await storage.createReport(this._db, data )
    }


    /// shared
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


    /// API

    async initializeUser () {

        await storage.createViewport(this._db,
            {label: '1920 × 1080', width: 1920, height: 1080, enabled: true})

        await storage.createViewport(this._db,
            {label: '1600 × 900', width: 1600, height: 900, enabled: false})

        await storage.createViewport(this._db,
            {label: '1536 × 864' , width: 1536, height: 864, enabled: false})
    }

    async enqueueRun (opts) {

        const runId = uuidv4()

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
        )

        await runQueue.push({
            runId,
            config,
            user: this._user,
            tenant: this._tenantId,
            userid: this._userId
        })

        return {
            enqueuedSuccessfully: true,
            scenariosCount: config.scenarios.length,
            viewportsCount: config.viewports.length
        }
    }
    async enqueueApproveCase (testCase) {

        let report = await storage.getReportById(this._db, testCase.reportId);

        console.log('report.runId', report.runId)

        const configPaths = engine.buildConfigPaths(this._tenantId, this._userId)
        engine.convertReportPath(configPaths, report.runId, report)

        let pairs = report
          .tests
          .filter( t =>
            t.pair.label === testCase.label &&
            t.pair.viewportLabel === testCase.viewportLabel
          )
          .map( x => ({
              label: x.pair.label,
              reference: x.pair.reference,
              test: x.pair.test
          }))

        if (pairs && pairs.length === 1) {

            let pair = pairs[0]
            // console.log('>>>>pair', pair)

            await approveQueue.push( {
                pair,
                tenant : this._tenantId,
                userid : this._userId,
                user: this._user
            } )

            return { enqueuedSuccessfully : true }
        }
        else {
            return { enqueuedSuccessfully : false }
        }
    }

    async getReportByRunId (runId) {

        const report = await storage.getReportByRunId(this._db, runId)
        const config = await this.getConfig();

        engine.convertReportPath(config.paths, runId, report)

        return report
    }

    /// filter: {state, startedBy, startedSince}
    async getHistoryRecords (filter, limit) {

        let query = {}

        if (filter) {

            const state = new SingleValueRule(filter.state, ['Passed', 'Failed', 'Running', 'Approved'])
            const not_state = new SingleValueRule(filter.not_state, ['Passed', 'Failed', 'Running', 'Approved'])
            const startedBy = new SingleValueRule(filter.startedBy, ['Run by me'])
            const viewports = new ArrayRule(filter.viewports)
            const startedSince = new SinceDateRule(filter.startedSince)
            const beforeStartedAt = new BeforeDateRule(filter.beforeStartedAt)

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
            const favorites = new BooleanValueRule(filter.favorites)

            if (favorites.isValid()) {
                query.meta_isFavorite = favorites.toQueryPart()
            }
        }

        return await storage.getScenarios(this._db, query)
    }
    async createScenario (data) {

        validateScenario(data);
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

        validateScenario(data);
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
