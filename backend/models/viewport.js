const {Schema, model} = require('mongoose')

const schema = new Schema({
    label: String,
    width: Number,
    height: Number
})

module.exports = model('Viewport', schema)
