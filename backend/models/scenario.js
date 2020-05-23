const {Schema, model} = require('mongoose');

const scenarioSchema = new Schema({

    /// BackstopJS fields
    //label: String,
    label: { "type": String, "required": true, "unique": true },
    url: String,
    misMatchThreshold: Number, /// Decimal 0-100. Test sensitivity, tolerance to difference
    readySelector: String,
    delay: Number,
    readyEvent: String,
    hideSelectors: Array,         /// String array
    removeSelectors: Array,       /// String array
    clickSelector: String,        /// String
    clickSelectors: Array,        /// String array (puppeteer only)
    scrollToSelector: String,
    hoverSelectors: Array,        /// String array
    postInteractionWait: Number,

    selectors: Array,
    selectorExpansion: Boolean, /// Default false, unused when selectors is empty
    expect: Number, /// Default 0, unused when selectorExpansion=false

    meta_isFavorite: Boolean,
    meta_recentRunStatus: String,  /// Passed/Failed status of recent run
    meta_referenceImageUrl: String  /// Url of reference == recent approved image url
});

module.exports = {
    scenarioSchema,
    Scenario: model('Scenario', scenarioSchema)
}
