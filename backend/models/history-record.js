const { Schema, model } = require('mongoose')

const recordSchema = new Schema({

    runId: String,
    state: String, /// Running, Finished
    startedAt: Date,
    finishedAt: Date,
    startedBy: String,
    scenarios: [String],
    viewports: [String]
})

module.exports = {
    recordSchema,
    Record: model('Record', recordSchema)
}
