# AUTH

## User
    tenant
    user
    password
    enabled



# API

## User                                     *Preferences*
    accountName
    paths
        bitmaps_reference
        engine_scripts
        bitmaps_test
        html_report
        ci_report
        json_report


## Scenario
    label
    url
    misMatchThreshold
    readySelector
    delay
    readyEvent
    hideSelectors
    removeSelectors
    clickSelector
    clickSelectors
    scrollToSelector
    hoverSelectors
    postInteractionWait
    selectors
    selectorExpansion
    expect
    meta_isFavorite
    meta_recentRunStatus
    meta_referenceImageUrl


## Viewport
    label
    width
    height
    enabled


## Record
    runId
    state
    startedAt
    finishedAt
    startedBy
    scenarios
        id
        label
        status
    viewports[]


## Report
    runId
    testSuite
    tests
        type []
            pair 
                reference
                test
                selector
                fileName
                label
                misMatchThreshold
                url
                expect
                viewportLabel
                diff
                    isSameDimensions
                    dimensionDifference
                        width
                        height
                    misMatchPercentage
                    analysisTime
                diffImage
                error
            status

