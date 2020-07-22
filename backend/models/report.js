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
                    engineErrorMsg: String,
                    error: String,

                    meta_testLG: String,        /// url of resized test result image (large size),
                    meta_diffImageLG: String    /// url of resized difference image (large size)
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
