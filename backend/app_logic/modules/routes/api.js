const express = require('express');
const router = express.Router();
const VRT = require('../../domain/vrt');

const tryWrapper = async (req, res, action) => {

    try {
        await action()
    }
    catch (error) {
        console.error('[API] Error', error)
        res.status(500).send( { error: error.uiError || 'Error occurs' } )
    }
}

/// Initialize new user:
/// Create default viewports and example scenarios
router.post('/user/initialize', async function(req, res) {

    tryWrapper(req, res, async () => {

        console.log('/user/initialize', req.context)

        const data = await VRT.create(req.context).initializeUser()
        res.status(200).send( { data } )
    })
});


router.post('/test/run', async function(req, res) {

    var opts = {
        ...req.body,  // TODO: sanitize body
    };

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).enqueueRun(opts)
        res.status(200).send( { data } )
    })
});

router.post('/test/approvecase', async function(req, res) {

    const {reportId, testCaseIndex} = req.body;  // TODO: sanitize body

    if (!reportId || testCaseIndex == null || testCaseIndex < 0) {
        return res.status(400).send();
    }

    tryWrapper(req, res, async () => {

        const result = await VRT.create(req.context).enqueueApproveCase({reportId, testCaseIndex})

        console.log('[VRT] approvecase result', result);

        if (result.enqueuedSuccessfully) {

            res.status(200)
              .send( { message:'Successfully approved'} )
        }
        else {
            res.status(500)
              .send( {message:'Cannot approve'} );
        }
    })
});


router.get('/test/widgets/:widget', async function(req, res) {

    const widget = req.params.widget;

    tryWrapper(req, res, async () => {

        const vrt = VRT.create( req.context );

        switch (widget) {

            case 'recently_failed':

                res.status(200).send( {
                    data: await vrt.getRecentlyFailedJob()
                })
                break;

            default:
                res.status(400).send()
        }

    })
});


router.get('/test/report/:runId', async function(req, res) {

    const runId = req.params.runId; // TODO: sanitize

    tryWrapper(req, res, async () => {

        const report = await VRT.create(req.context).getReportByRunId(runId);
        res.status(200).send( {report} )
    })
});

router.get('/test/history/:id', async function(req, res) {

    tryWrapper(req, res, async () => {

        const job = await VRT.create(req.context).getHistoryRecordById(req.params.id)
        res.status(200).send( job )
    })
});

router.get('/test/history', async function(req, res) {

    tryWrapper(req, res, async () => {

        const state = req.query.state;
        const not_state = req.query.not_state;
        const startedBy = req.query.startedBy;
        const startedSince = req.query.startedSince;
        const viewports = req.query.viewports;
        const beforeStartedAt = req.query.beforeStartedAt;
        const limit = 30;

        const vrt = VRT.create(req.context);

        const jobs = await vrt.getHistoryRecords({state, not_state, startedBy, startedSince, viewports, beforeStartedAt}, limit)
        const total = await vrt.getHistoryRecordsCount()

        res.status(200).send( {jobs, total} )
    })
});

// Delete history record
router.delete('/test/history/:id', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).deleteHistoryRecord( req.params.id )
        res.status(200).send( {data} )
    })
});

// Delete all history records
router.delete('/test/histories', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).deleteAllHistoryRecords()
        res.status(200).send( {data} )
    })
});


// Get history of test case (scenario runs)
router.get('/test/scenario/:id/runs', async function(req, res) {

    const scenarioId = req.params.id; // TODO: sanitize

    tryWrapper(req, res, async () => {

        const jobs = await VRT.create(req.context).getHistoryRecordsOfScenario(scenarioId)
        res.status(200).send( {jobs} )
    })
});

// Get scenario by Id
router.get('/test/scenario/:id', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create( req.context ).getScenarioById( req.params.id )
        res.status( 200 ).send( { data } )
    })
});

// Get scenarios
router.get('/test/scenarios', async function(req, res) {

    tryWrapper(req, res, async () => {

        const favorites = req.query.favorites;

        const data = await VRT.create( req.context ).getScenarios({favorites})
        res.status( 200 ).send( { data } )
    })
});

// Clone scenario
router.post('/test/scenario/:id/clone', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).cloneScenario(req.params.id, req.body)
        res.status(200).send( {data} )
    })
});

// Add scenario to favorite
router.post('/test/scenario/:id/favorite', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).addScenarioToFavorites(req.params.id)
        res.status(200).send( {data} )
    })
});

// Switch: Add or Delete scenario to/from favorite
router.put('/test/scenario/:id/favorite', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).switchScenarioFavorite(req.params.id)
        res.status(200).send( {data} )
    })
});

// Delete scenario from favorites
router.delete('/test/scenario/:id/favorite', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).removeScenarioFromFavorites(req.params.id)
        res.status(200).send( {data} )
    })
});

// Create scenario
router.post('/test/scenario', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).createScenario(req.body)
        res.status(200).send( {data} )
    })
});

// Update scenario
router.put('/test/scenario/:id', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).updateScenario(req.params.id, req.body)
        res.status(200).send( {data} )
    })
});

// Delete scenario
router.delete('/test/scenario/:id', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).deleteScenario(req.params.id)
        res.status(200).send( {data} )
    })
});

// Get viewport by Id
router.get('/test/viewport/:id', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).getViewportById(req.params.id)
        res.status(200).send( {data} )
    })
});

// Get viewport
router.get('/test/viewports', async function(req, res) {

    tryWrapper(req, res, async () => {

        let query = {};

        if (req.query.enabled) {
            query.enabled = req.query.enabled === 'true';
        }

        const data = await VRT.create(req.context).getViewports( query )
        res.status(200).send( {data} )
    })
});

// Bulk upsert viewports
router.put('/test/viewports', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).upsertViewports(req.body)
        res.status(data.status || 200).send( {data} )
    })
});

// Create viewport
router.post('/test/viewport', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).createViewport(req.body)
        res.status(200).send( {data} )
    })
});

// TODO: UNUSED?
// Update viewport
router.put('/test/viewport/:id', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).updateViewport(req.params.id, req.body)
        res.status(200).send( {data} )
    })
});

// Delete viewport
router.delete('/test/viewport/:id', async function(req, res) {

    tryWrapper(req, res, async () => {

        const data = await VRT.create(req.context).deleteViewport(req.params.id)
        res.status(200).send( {data} )
    })
});



module.exports = router;
