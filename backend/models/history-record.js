const { Schema, model } = require('mongoose')

const schema = new Schema({
    
    scenarios: Array,
    completed: Boolean,
    failed: Boolean,
    state: String, /// Running, Finished
    timestamp: Date
})

module.exports = model('Record', schema)
