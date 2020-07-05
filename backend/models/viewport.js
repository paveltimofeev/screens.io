const {Schema, model} = require('mongoose')

const viewportSchema = new Schema({
    label: { "type": String, "required": true, "unique": true },
    width: { "type": Number, "required": true },
    height: Number,
    enabled: Boolean
})

module.exports = {
    viewportSchema,
    Viewport: model('Viewport', viewportSchema)
}
