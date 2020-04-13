const { Schema, model } = require('mongoose');

const schema = new Schema({
    runId: String,
    testSuite: String,
    tests: {
        type: [
            {
                pair: {
                    reference: String,
                    test: String,
                    selector: String,
                    fileName: String,
                    label: String,
                    misMatchThreshold: String,
                    url: String,
                    expect: Number,
                    viewportLabel: String,
                    error: String
                },
                status: String
            }
        ]
    }
})

module.exports = model('Report', schema)
