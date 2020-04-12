const Record = require('./models/history-record')

class Storage {

    async getAllHistoryRecords () {

        return await Record.find({})
    }

    async newHistoryRecord (data) {
        
        const record = new Record({state: 'New', ...data})
        return await record.save()
    }

    async updateHistoryRecord (id, data) {
        
        let record = await Record.findById(id)
        Object.keys(data).forEach(x => record[x] = data[x])
        return await record.save()
    }
}


module.exports = Storage
