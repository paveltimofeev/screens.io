const { Schema, model } = require('mongoose');

const schema = new Schema({
    testSuite: string,
    tests: {
        type: [
            {
                status: String,
                pair: {
                    reference: String
                }
            }
        ]
    }
})

module.exports = model('Report', schema)
