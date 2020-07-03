const mongoose = require('mongoose')
const { recordSchema } = require('../models/history-record')
const { scenarioSchema } = require('../models/scenario')
const { viewportSchema } = require('../models/viewport')
const { reportSchema } = require('../models/report')
const { UIError } = require('../ui-error')
const config = require('./../config');

class Storage {

    constructor () {

        this.__connectionsPool = {};
    }

    _getConnection (database) {

        if (!database || database.trim() === '') {
            throw new Error('No database name')
        }

        if (this.__connectionsPool[database]) {
            console.log('[Storage] use cached conn', database);
            return this.__connectionsPool[database];
        }

        const conn = mongoose.createConnection(`${config.storageConnectionString}/user_${database}`,
          {
              useNewUrlParser: true,
              useFindAndModify: true,
              useUnifiedTopology: true,
              keepAlive: true,
              socketTimeoutMS: 60 * 1000, // Close sockets after N seconds of inactivity
              connectTimeoutMS: 30 * 1000
          });

        this.__connectionsPool[database] = conn;
        return conn;
    }

    async _dbOperations (database, collection, schema, opsCallback) {

        if (!collection || collection.trim() === '') {
            throw new Error('No collection name')
        }

        if (!schema) {
            throw new Error('No schema')
        }

        let connection;

        try {

            connection = this._getConnection(database);
            let entity = connection.model( collection, schema );
            return await opsCallback( entity );
        }
        catch(err) {

            console.log('[DbOperations] ERROR', err);
            throw err
        }
        finally {

            // if (connection) {
            //     connection.close()
            // }
        }
    }


    async _create (database, collection, schema, data) {

        return this._dbOperations(database, collection, schema, async (entity) => {
            // let entity = this._createEntity(database, collection, schema)
            const newEntry = new entity(data)
            return await newEntry.save()
        });
    }
    async _update (database, collection, schema, id, data) {

        return this._dbOperations(database, collection, schema, async (entity) => {

            // let entity = this._createEntity( database, collection, schema )
            let entry = await entity.findById( id )
            Object.keys( data ).forEach( x => entry[ x ] = data[ x ] )
            return await entry.save()
        });
    }
    async _bulkUpsert (database, collection, schema, bulkOps) {

        return this._dbOperations(database, collection, schema, async (entity) => {
            // let entity = this._createEntity(database, collection, schema);
            return await entity.bulkWrite( bulkOps );
        });
    }
    async _getAll (database, collection, schema) {
        return await this._getByQuery(database, collection, schema, {})
    }
    async _getByQuery (database, collection, schema, query) {

        return this._dbOperations(database, collection, schema, async (entity) => {
            // let entity = this._createEntity(database, collection, schema)
            return await entity.find( query || {} )
        });
    }
    async _getById (database, collection, schema, id) {

        return this._dbOperations(database, collection, schema, async (entity) => {
            //let entity = this._createEntity(database, collection, schema)
            return await entity.findById( id )
        });
    }
    async _deleteById (database, collection, schema, id) {

        return this._dbOperations(database, collection, schema, async (entity) => {
            // let entity = this._createEntity(database, collection, schema)
            return await entity.deleteOne( { _id : id } )
        });
    }
    async _deleteAll (database, collection, schema) {

        return this._dbOperations(database, collection, schema, async (entity) => {
            // let entity = this._createEntity(database, collection, schema)
            return await entity.remove( {} )
        });
    }

    async getHistoryRecordById (database, id) {
        return await this._getById(database, 'Record', recordSchema, id)
    }
    async getHistoryRecords (database, query, limit) {

        const isValidNumber = (value) => {
            return value && /^[0-9]{1,10}$/.test(value)
        }

        limit = isValidNumber(limit) ? parseInt(limit) : 10

        return this._dbOperations(database, 'Record', recordSchema,
          async(entity) => {

            return await entity.find(query||{}).sort({ _id: 'desc'}).limit(limit)
        });
    }
    async getHistoryRecordsStats (database) {

        let count = this._dbOperations(database, 'Record', recordSchema, async (entity) => {
            return await entity.count()
        });

        return {
            count: count
        }
    }
    async createHistoryRecord (database, data) {

        return await this._create(database, 'Record', recordSchema, {state: 'New', ...data})
    }
    async deleteHistoryRecord (database, id) {

        return await this._deleteById(database, 'Record', recordSchema, id)
    }
    async deleteAllHistoryRecords (database) {

        return await this._deleteAll(database, 'Record', recordSchema)
    }
    async updateHistoryRecord (database, id, data) {

        return this._update(database, 'Record', recordSchema, id, data)
    }

    async getScenarioById (database, id) {

        return await this._getById(database, 'Scenario', scenarioSchema, id)
    }
    async getScenarioByLabel (database, label) {

        const results = await this._getByQuery(
          database, 'Scenario', scenarioSchema, { "label": label }
        )

        if ( !results || results.length === 0 ) {
            UIError.throw(`No scenarios found with label '${label}'`,
              {database, label})
        }
        else if (results.length > 1) {
            UIError.throw(`More than one scenario found (${results.length}) with label '${label}'`,
              {database, label})
        }

        return results[0]
    }
    async getScenarios (database, query) {

        return await this._getByQuery(database, 'Scenario', scenarioSchema, query)
    }
    async createScenario (database, data) {

        return await this._create(database, 'Scenario', scenarioSchema, {...data})
    }
    async cloneScenario (database, originalScenarioId, data) {

        let scenario = await this.getScenarioById(database, originalScenarioId)

        let newScenario = this.convertToObject(scenario);
        delete newScenario._id;
        delete newScenario.meta_isFavorite;
        delete newScenario.meta_recentRunStatus;

        return await this._create(database, 'Scenario', scenarioSchema, {
            ...newScenario,
            ...data
        })
    }
    async updateScenario (database, id, data) {

        return this._update(database, 'Scenario', scenarioSchema, id, data)
    }
    async updateScenarioByLabel (database, label, data) {

        let entry = await this.getScenarioByLabel(database, label)
        Object.keys(data).forEach(x => entry[x] = data[x])
        return await entry.save()
    }
    async deleteScenario (database, id) {

        return await this._deleteById(database, 'Scenario', scenarioSchema, id)
    }


    async getViewportById (database, id) {
        return await this._getById(database, 'Viewport', viewportSchema, id)
    }
    async getViewports (database, query) {
        return await this._getByQuery(database, 'Viewport', viewportSchema, query)
    }
    async bulkWriteViewports (database, viewports, upsert) {

        // https://stackoverflow.com/questions/39988848/trying-to-do-a-bulk-upsert-with-mongoose-whats-the-cleanest-way-to-do-this
        /// TODO: Do not insert values, need to figure out and make correct UPSERT
        /// so filter out values without _id and make bulk update
        var bulkOps = viewports
          .filter(x => x._id)
          .map( viewport => ({
            'updateOne': {
                'filter': { _id: viewport._id },
                'update': viewport,
                'upsert': upsert // true | false
            }
        }));

        /// then filter values without _id and insert them (without bulk)
        viewports
          .filter(x => !x._id)
          .forEach( async (viewport) => {
              return await this.createViewport(database,viewport)
        });

        return await this._bulkUpsert(database, 'Viewport', viewportSchema, bulkOps);
    }
    async createViewport (database, data) {

        return await this._create(database, 'Viewport', viewportSchema, {...data})
    }
    async updateViewport (database, id, data) {

        return this._update(database, 'Viewport', viewportSchema, id, data)
    }
    async deleteViewport (database, id) {

        return await this._deleteById(database, 'Viewport', viewportSchema, id)
    }


    async getReportById (database, id) {
        return await this._getById(database, 'Report', reportSchema, id)
    }
    async getReportByRunId (database, runId) {

        const postProcess = (report) => {

            report.tests.forEach( t => {
                if ( t.pair.error
                  && t.pair.error.startsWith('Reference file not found')
                ){
                    t.pair.error = 'NO_REFERENCE' //There is no approved reference for this scenario and viewport.
                }

                if ( t.pair.error
                  && t.pair.error.startsWith('Test file not found')
                ){
                    t.pair.error = 'NO_RESULTS' //There is no results of tests. Probably test crashed.
                }
            })
        }

        return this._dbOperations(database, 'Report', reportSchema, async (entity) => {
            // let entity = this._createEntity(database, 'Report', reportSchema)

            let report = await entity.findOne( { runId : runId } )
            postProcess( report )
            return report
        })
    }
    async createReport (database, data) {

        return await this._create(database, 'Report', reportSchema, data)
    }


    convertToObject (entry) {

        if (!entry) {
            return null;
        }

        let obj = entry.toObject();
        delete obj._id;
        delete obj.__v;
        return obj;
    }
}


module.exports = Storage
