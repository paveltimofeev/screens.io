const mongoose = require('mongoose')
const { recordSchema } = require('../models/history-record')
const { scenarioSchema } = require('../models/scenario')
const { viewportSchema } = require('../models/viewport')
const { reportSchema } = require('../models/report')
const { UIError } = require('../ui-error')


class Storage {

    convertToObject (entry) {

        delete entry._id;
        delete entry.__v;
        return JSON.parse(JSON.stringify(entry))
    }

    _createEntity (database, collection, schema) {

        if (!database || database.trim() === '') {
            throw new Error('No database name')
        }

        if (!collection || collection.trim() === '') {
            throw new Error('No collection name')
        }

        if (!schema) {
            throw new Error('No schema')
        }

        const connection = mongoose.createConnection(
          `mongodb://localhost:27017/user_${database}`,
          {
              useNewUrlParser: true,
              useFindAndModify: true,
              useUnifiedTopology: true
          });

        return connection.model(collection, schema);
    }


    async _create (database, collection, schema, data) {

        let entity = this._createEntity(database, collection, schema)
        const newEntry = new entity(data)
        return await newEntry.save()
    }
    async _update (database, collection, schema, id, data) {

        let entity = this._createEntity(database, collection, schema)
        let entry = await entity.findById(id)
        Object.keys(data).forEach(x => entry[x] = data[x])
        return await entry.save()
    }
    async _getAll (database, collection, schema) {
        return await this._getByQuery(database, collection, schema, {})
    }
    async _getByQuery (database, collection, schema, query) {
        let entity = this._createEntity(database, collection, schema)
        return await entity.find(query || {})
    }
    async _getById (database, collection, schema, id) {

        let entity = this._createEntity(database, collection, schema)
        return await entity.findById(id)
    }
    async _deleteById (database, collection, schema, id) {

        let entity = this._createEntity(database, collection, schema)
        return await entity.deleteOne({_id: id})
    }
    async _deleteAll (database, collection, schema) {

        let entity = this._createEntity(database, collection, schema)
        return await entity.remove({})
    }


    async getHistoryRecordById (database, id) {
        return await this._getById(database, 'Record', recordSchema, id)
    }
    async getHistoryRecords (database, query, limit) {

        const isValidNumber = (value) => {
            return value && /^[0-9]{1,10}$/.test(value)
        }

        limit = isValidNumber(limit) ? parseInt(limit) : 1000

        let entity = this._createEntity(database, 'Record', recordSchema)
        return await entity.find(query||{}).sort({ _id: 'desc'}).limit(limit)
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

        let newScenario = this.convertToObject(scenario)
        delete newScenario._id

        return await this._create(database, 'Scenario', scenarioSchema, {
            ...newScenario,
            ...data
        })
    }
    async updateScenario (database, id, data) {

        return this._update(database, 'Scenario', scenarioSchema, id, data)
    }
    async deleteScenario (database, id) {

        return await this._deleteById(database, 'Scenario', scenarioSchema, id)
    }


    async getViewportById (database, id) {
        return await this._getById(database, 'Viewport', viewportSchema, id)
    }
    async getViewports (database) {

        return await this._getAll(database, 'Viewport', viewportSchema)
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

        let entity = this._createEntity(database, 'Report', reportSchema)
        return await entity.findOne( {runId: runId} )
    }
    async createReport (database, data) {

        return await this._create(database, 'Report', reportSchema, data)
    }
}


module.exports = Storage
