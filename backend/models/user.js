const { Schema, model } = require('mongoose')

const schema = new Schema({
    accountName: String
})

module.exports = model('User', schema)
