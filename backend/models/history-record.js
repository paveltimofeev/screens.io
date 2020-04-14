const { Schema, model } = require('mongoose')

const recordSchema = new Schema({

    runId: String,
    state: String, /// Running, Finished
    startedAt: Date,
    scenarios: Array
})

module.exports = {
    recordSchema,
    Record: model('Record', recordSchema)
}
