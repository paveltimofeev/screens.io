const { Schema, model } = require('mongoose')

const recordSchema = new Schema({

    runId: String,
    state: String, /// Running, Finished
    startedAt: Date,
    finishedAt: Date,
    startedBy: String,
    scenarios: [{
        id: String,
        label: String,
        status: String
    }],
    viewports: [String]
})

module.exports = {
    recordSchema,
    Record: model('Record', recordSchema)
}
