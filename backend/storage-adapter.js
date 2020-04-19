const mongoose = require('mongoose')
const { recordSchema } = require('./models/history-record')
const { scenarioSchema } = require('./models/scenario')
const { viewportSchema } = require('./models/viewport')
const { reportSchema } = require('./models/report')

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


    async getHistoryRecords (database) {

        let entity = this._createEntity(database, 'Record', recordSchema)
        return await entity.find({}).sort({ _id: 'desc'})
    }
    async createHistoryRecord (database, data) {

        let entity = this._createEntity(database, 'Record', recordSchema)
        const record = new entity({state: 'New', ...data})
        return await record.save()
    }
    async deleteHistoryRecord (database, id) {

        let entity = this._createEntity(database, 'Record', recordSchema)
        return await entity.deleteOne({_id: id})
    }
    async updateHistoryRecord (database, id, data) {

        let entity = this._createEntity(database, 'Record', recordSchema)
        let record = await entity.findById(id)
        Object.keys(data).forEach(x => record[x] = data[x])
        return await record.save()
    }


    async getScenarioById (database, id) {

        let entity = this._createEntity(database, 'Scenario', scenarioSchema)
        return await entity.findById(id)
    }
    async getScenarios (database, query) {

        let entity = this._createEntity(database, 'Scenario', scenarioSchema)
        return await entity.find(query || {})
    }
    async createScenario (database, data) {

        let entity = this._createEntity(database, 'Scenario', scenarioSchema)
        const newEntry = new entity({...data})
        return await newEntry.save()
    }
    async cloneScenario (database, originalScenarioId, data) {

        let scenario = await this.getScenarioById(originalScenarioId)

        let newScenario = this.convertToObject(scenario)
        let entity = this._createEntity(database, 'Scenario', scenarioSchema)
        const newEntry = new entity({
            ...newScenario,
            ...data
        })
        return await newEntry.save()
    }
    async updateScenario (database, id, data) {

        let entity = this._createEntity(database, 'Scenario', scenarioSchema)
        let entry = await entity.findById(id)
        Object.keys(data).forEach(x => entry[x] = data[x])
        return await entry.save()
    }
    async deleteScenario (database, id) {

        let entity = this._createEntity(database, 'Scenario', scenarioSchema)
        return await entity.deleteOne({_id: id})
    }


    async getViewportById (database, id) {
        let entity = this._createEntity(database, 'Viewport', viewportSchema)
        return await entity.findById(id)
    }
    async getViewports (database) {
        let entity = this._createEntity(database, 'Viewport', viewportSchema)
        return await entity.find({})
    }
    async createViewport (database, data) {

        let entity = this._createEntity(database, 'Viewport', viewportSchema)
        const newEntry = new entity({...data})
        return await newEntry.save()
    }
    async updateViewport (database, id, data) {

        let entity = this._createEntity(database, 'Viewport', viewportSchema)
        let entry = await entity.findById(id)
        Object.keys(data).forEach(x => entry[x] = data[x])
        return await entry.save()
    }
    async deleteViewport (database, id) {

        let entity = this._createEntity(database, 'Viewport', viewportSchema)
        return await entity.deleteOne({_id: id})
    }


    async getReportByRunId (database, runId) {

        let entity = this._createEntity(database, 'Report', reportSchema)
        return await entity.findOne( {runId: runId} )
    }
    async createReport (database, data) {

        let entity = this._createEntity(database, 'Report', reportSchema)
        const newEntry = new entity(data)
        return await newEntry.save()
    }
}


module.exports = Storage
