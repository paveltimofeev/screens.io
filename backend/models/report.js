const { Schema, model } = require('mongoose');

const reportSchema = new Schema({
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
                    diff: {
                        isSameDimensions: Boolean,
                        dimensionDifference: {
                            width: Number,
                            height: Number
                        },
                        misMatchPercentage: String,
                        analysisTime: Number
                    },
                    diffImage: String,
                    error: String
                },
                status: String
            }
        ]
    }
})

module.exports = {
    reportSchema,
    Report: model('Report', reportSchema)
}
