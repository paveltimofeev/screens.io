var backstop = require('backstopjs');
var fs = require('fs');
var { promisify } = require('util');
var path = require('path');
const storage = new (require('../storage-adapter'))
const engine = new (require('../engine-adapter'))

const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class VRT {

    constructor(tenantId, userId, customConfig) {

        this._tenantId = tenantId;
        this._userId = userId;
        this._customConfig = customConfig;
        this.refreshConfig();
    }

    refreshConfig () {

        this._config = this._getConfig();
    }

    async getReportByRunId (runId) {

        const report = await storage.getReportByRunId(runId)

        engine.convertReportPath(this._config.paths, runId, report)

        // report.tests.forEach( t => {
        //
        //     t.pair.reference = '\\' + path.join( this._config.paths.html_report, runId, t.pair.reference );
        //     t.pair.test = '\\' + path.join( this._config.paths.html_report, runId, t.pair.test );
        //
        //     if (t.pair.diffImage) {
        //         t.pair.diffImage = '\\' + path.join( this._config.paths.html_report, runId, t.pair.diffImage )
        //     }
        // });

        return report
    }

    getBasicConfig (cb) {

      fs.readFile(
        `vrt_data/${this._tenantId}/vrtconfig.json`,
        'utf8', (error, file) => {
            cb(error, JSON.parse(file))
        })
    }

    deleteScenarioFromBasicConfig(scenarioLabel, cb) {

        this.getBasicConfig( (err, config) => {

            let idx = config.scenarios.findIndex(x => x.label === scenarioLabel);
            config.scenarios.splice(idx, 1);

            this._writeDownConfig(config, cb);
        });
    }

    setBasicConfig (updData, cb) {

        this.getBasicConfig( (err, config) => {

            this._writeDownConfig( {...config, ...updData}, cb);
        })
    }

    _getConfig () {

        var config = JSON.parse(
                fs.readFileSync(`vrt_data/${this._tenantId}/vrtconfig.json`, 'utf8')
            );

        var result = {...config, ...this._customConfig}

        result.paths = {

            bitmaps_reference: `vrt_data/${this._tenantId}/bitmaps_reference`,
            engine_scripts: `vrt_data/${this._tenantId}/engine_scripts`,

            bitmaps_test: `vrt_data/${this._tenantId}/${this._userId}/bitmaps_test`,
            html_report: `vrt_data/${this._tenantId}/${this._userId}/html_report`,
            ci_report: `vrt_data/${this._tenantId}/${this._userId}/ci_report`,
            json_report: `vrt_data/${this._tenantId}/${this._userId}/json_report`
          };

        return result;
    }

    async getConfig( scenariosFilter ) {

        const viewports = await storage.getViewports()
        const scenarios = await storage.getScenarios( scenariosFilter )

        let config = engine.buildConfig(this._tenantId, this._userId,
          storage.convertToObject(viewports),
          storage.convertToObject(scenarios));

        return config
    }

    async getHistory () {

        return await storage.getAllHistoryRecords()
    }

    async run (opts) {

        const runId = uuidv4()

        let config = await this.getConfig( opts.filter ? {label: opts.filter } : undefined )

        config.paths.json_report = path.join(
          config.paths.json_report,
          runId
        )

        const record = await storage.newHistoryRecord({
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
            await storage.updateHistoryRecord(record._id, { state: 'Passed' })
            return runId
        }
        catch (err) {

            console.error('[VRT] Error:', err)
            const report = await engine.getReport(config.paths.json_report)
            await this.createReport(runId, report)
            await storage.updateHistoryRecord(record._id, { state: 'Failed' })
            return runId
        }
    }

    approve (cb) {

        backstop('approve', { config: this._config} )
            .then( (r) => { console.log('[VRT] approve done', r); cb(null, r); })
            .catch( (e) => { console.log('[VRT] approve failed', e); cb(e);});
    }

    approveCase (pair, cb) {

        const ref = path.join(__dirname, '..', pair.reference);
        const test = path.join(__dirname, '..', pair.test);

        fs.exists(test, (exists) => {

            if (!exists) {
                console.log('ERR: Cannot find TEST result', test);
                cb(test);
                return;
            }

            fs.copyFile(test, ref, (data) => {
                console.log('success:', data);
                cb(null, {success:true})
            });
        })
    }

    stop (cb) {

        backstop( 'stop' )
          .then( (r) => { console.log('[VRT] stop done', r); cb(null, r); })
          .catch( (e) => { console.log('[VRT] stop failed', e); cb(e);});
    }

    _writeDownConfig(config, cb) {

        fs.writeFile(
          `vrt_data/${this._tenantId}/vrtconfig.json`,
          JSON.stringify(config),
          'utf8',
          (error) => {

              if (!error) {
                  this.refreshConfig();
              }

              cb(error);
          })
    }



    async getScenarioById (id) {
        return await storage.getScenarioById(id)
    }
    async getScenarios () {
        return await storage.getScenarios()
    }
    async createScenario (data) {
        return await storage.createScenario(data)
    }
    async updateScenario (id, data) {
        return await storage.updateScenario(id, data)
    }
    async deleteScenario (id) {
        return await storage.deleteScenario(id)
    }


    async getViewportById (id) {
        return await storage.getViewportById(id)
    }
    async getViewports () {
        return await storage.getViewports()
    }
    async createViewport (data) {
        return await storage.createViewport(data)
    }
    async updateViewport (id, data) {
        return await storage.updateViewport(id, data)
    }
    async deleteViewport (id) {
        return await storage.deleteViewport(id)
    }

    async createReport (runId, data) {

        data.runId = runId;
        return await storage.createReport( data )
    }

}

module.exports = new VRT('test-tenant', 'test-user', {});
