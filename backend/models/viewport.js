const {Schema, model} = require('mongoose')

const viewportSchema = new Schema({
    label: String,
    width: Number,
    height: Number
})

module.exports = {
    viewportSchema,
    Viewport: model('Viewport', viewportSchema)
}
