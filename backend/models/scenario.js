const {Schema, model} = require('mongoose');

const scenarioSchema = new Schema({

    /// BackstopJS fields
    label: String,
    url: String,
    misMatchThreshold: Number, /// Decimal
    readySelector: String,
    delay: Number,
    readyEvent: String,
    hideSelectors: Array,         /// String array
    removeSelectors: Array,       /// String array
    clickSelectors: Array,        /// String array
    scrollToSelector: String,
    hoverSelectors: Array,        /// String array
    postInteractionWait: Number,

    latestScreenshot: String
});

module.exports = {
    scenarioSchema,
    Scenario: model('Scenario', scenarioSchema)
}
