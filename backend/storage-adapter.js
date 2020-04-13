const Record = require('./models/history-record')
const Scenario = require('./models/scenario')
const Viewport = require('./models/viewport')
const Report = require('./models/report')


class Storage {

    convertToObject (entry) {

        delete entry._id;
        delete entry.__v;
        return JSON.parse(JSON.stringify(entry))
    }

    async getAllHistoryRecords () {

        return await Record.find({}).sort({ _id: 'desc'})
    }
    async newHistoryRecord (data) {

        const record = new Record({state: 'New', ...data})
        return await record.save()
    }
    async deleteHistoryRecord (id) {

        return await Record.deleteOne({_id: id})
    }


    async updateHistoryRecord (id, data) {

        let record = await Record.findById(id)
        Object.keys(data).forEach(x => record[x] = data[x])
        return await record.save()
    }


    async getScenarioById (id) {
        return await Scenario.findById(id)
    }
    async getScenarios (query) {
        return await Scenario.find(query || {})
    }
    async createScenario (data) {

        const newEntry = new Scenario({...data})
        return await newEntry.save()
    }
    async updateScenario (id, data) {

        let entry = await Scenario.findById(id)
        Object.keys(data).forEach(x => entry[x] = data[x])
        return await entry.save()
    }
    async deleteScenario (id) {

        return await Scenario.deleteOne({_id: id})
    }

    async getViewportById (id) {
        return await Viewport.findById(id)
    }
    async getViewports () {
        return await Viewport.find({})
    }
    async createViewport (data) {

        const newEntry = new Viewport({...data})
        return await newEntry.save()
    }
    async updateViewport (id, data) {

        let entry = await Viewport.findById(id)
        Object.keys(data).forEach(x => entry[x] = data[x])
        return await entry.save()
    }
    async deleteViewport (id) {

        return await Viewport.deleteOne({_id: id})
    }

    async getReportByRunId (runId) {
        return await Report.findOne( {runId: runId} )
    }
    async createReport (data) {

        console.log('createReport', data)
        const newEntry = new Report(data)
        return await newEntry.save()
    }

}


module.exports = Storage
