# AUTH

## User
    tenant
    user
    password
    email
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
    meta_referenceSM
    meta_referenceMD
    meta_referenceLG
    


## Viewport
    label
    width
    height
    enabled


## History Record / Job Item
    _id   *JobId*
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


## Report / Json Report / Run Results
    _id
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

