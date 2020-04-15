const express = require('express');
const router = express.Router();
const VRT = require('../app_logic/vrt');

const vrt = new VRT('test-tenant', 'test-user');

const createContext = (req) => {

    return {
        user: req.header('x-auth-proxy-user')
    }
}

router.post('/test/run', async function(req, res) {

    var opts = {
        ...req.body,  // TODO: sanitize body
    };

    try {
        const data = await VRT.create(req.context).run(opts)
        res.status(200).send( { data } )
    }
    catch (error) {
        console.error('[API] Error', error)
        res.status(500).send( { error } )
    }
});

router.post('/test/approvecase', function(req, res) {

    const pair = req.body; // TODO: sanitize body

    vrt.approveCase( {reference: pair.reference, test: pair.test}, (err, data) => {

        console.log('[VRT] approvecase err', err);
        console.log('[VRT] approvecase data', data);

        if (err) {
            res.status(500).send( {message:'Cannot approve'} );
        }
        else {
            res.status(200).send( data );
        }
    });
});

router.get('/test/report/:runId', async function(req, res) {

    const runId = req.params.runId; // TODO: sanitize

    try {
        const report = await VRT.create(req.context).getReportByRunId(runId);
        res.status(200).send( {report} )
    }
    catch (error) {
        console.error('[API] ' + req.path, error)
        res.status(200).send( {error: 'Cannot get report'} );
    }
});

router.get('/test/history', async function(req, res) {

    try {
        const jobs = await VRT.create(req.context).getHistoryRecords()
        res.status(200).send( {jobs} )
    }
    catch (error) {
        res.status(500).send( {error} )
    }
});

// Delete history record
router.delete('/test/history/:id', async function(req, res) {

    try {
        const data = await VRT.create(req.context).deleteHistoryRecord(req.params.id)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});


// Get scenario by Id
router.get('/test/scenario/:id', async function(req, res) {

    try {

        const data = await VRT.create(req.context).getScenarioById(req.params.id)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Get scenarios
router.get('/test/scenarios', async function(req, res) {

    try {

        const ctx = createContext(req);

        const data = await VRT.create(req.context).getScenarios()
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Create scenario
router.post('/test/scenario', async function(req, res) {

    try {

        const data = await VRT.create(req.context).createScenario(req.body)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Update scenario
router.put('/test/scenario/:id', async function(req, res) {

    try {

        const data = await VRT.create(req.context).updateScenario(req.params.id, req.body)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Delete scenario
router.delete('/test/scenario/:id', async function(req, res) {

    try {
        const data = await VRT.create(req.context).deleteScenario(req.params.id)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Get viewport by Id
router.get('/test/viewport/:id', async function(req, res) {

    try {

        const data = await VRT.create(req.context).getViewportById(req.params.id)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Get viewport
router.get('/test/viewports', async function(req, res) {

    try {

        const data = await VRT.create(req.context).getViewports()
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Create viewport
router.post('/test/viewport', async function(req, res) {

    try {

        const data = await VRT.create(req.context).createViewport(req.body)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Update viewport
router.put('/test/viewport/:id', async function(req, res) {

    try {

        const data = await VRT.create(req.context).updateViewport(req.params.id, req.body)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Delete viewport
router.delete('/test/viewport/:id', async function(req, res) {

    try {
        const data = await VRT.create(req.context).deleteViewport(req.params.id)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});



module.exports = router;
