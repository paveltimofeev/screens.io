const { Schema, model } = require('mongoose')

const schema = new Schema({
    
    runId: String,
    state: String, /// Running, Finished
    startedAt: Date,
    scenarios: Array
})

module.exports = model('Record', schema)
