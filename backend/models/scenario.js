const {Schema, model} = require('mongoose');

const scenarioSchema = new Schema({

    /// BackstopJS fields
    label: String,
    url: String,
    misMatchThreshold: Number, /// Decimal 0-100. Test sensitivity, tolerance to difference
    readySelector: String,
    delay: Number,
    readyEvent: String,
    hideSelectors: Array,         /// String array
    removeSelectors: Array,       /// String array
    clickSelectors: Array,        /// String array
    scrollToSelector: String,
    hoverSelectors: Array,        /// String array
    postInteractionWait: Number,

    selectors: Array,
    selectorExpansion: Boolean, /// Default false, unused when selectors is empty
    expect: Number, /// Default 0, unused when selectorExpansion=false

    meta_isFavorite: Boolean
});

module.exports = {
    scenarioSchema,
    Scenario: model('Scenario', scenarioSchema)
}
