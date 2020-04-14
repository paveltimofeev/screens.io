const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    accountName: String,

    paths: {
        bitmaps_reference: String,
        engine_scripts: String,
        bitmaps_test: String,
        html_report: String,
        ci_report: String,
        json_report: String
    }
})

module.exports = model('User', UserSchema)
