var express = require('express');
var router = express.Router();
var vrt = require('../app_logic/vrt');
const storage = new (require('../storage-adapter'))

/*
    API CALLS

    [post] /api/test/run                        <-  { error, data }
    [post] /api/approve/:jobId                  <-  { status: 'approved' }
     [get] /api/test/report/:jobId              <-  { error, report }
     [get] /api/test/history                    <-  { error, jobs }
     [get] /api/test/config                     <-  { error, data }
     [put] /api/test/config                     <-  { error, data }
     [delete] /api/test/scenario {label}        <-  { error, data }
*/

router.post('/test/run', async function(req, res, next) {

    var opts = {
        ...req.body,  // TODO: sanitize body
    };

    try {
        const data = await vrt.run(opts)
        res.status(200).send( { data } )
    }
    catch (error) {
        console.error('[API] Error', error)
        res.status(500).send( { error } )
    }
});

router.post('/test/approve/:jobId', function(req, res, next) {

    // TODO: sanitize jobId

    vrt.approve( (error, data) => {
        res.status( !error ? 200 : 500).send( {status: error || data} );
    });
});

router.post('/test/approvecase', function(req, res, next) {

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

router.get('/test/report/:jobId', async function(req, res) {

    const jobId = req.params.jobId; // TODO: sanitize

    try {
        const report = await vrt.getReport(jobId);
        res.status(200).send( {report} )
    }
    catch (error) {
        console.error('[API] ' + req.path, error)
        res.status(200).send( {error: 'Cannot get report'} );
    }
});

router.get('/test/history', async function(req, res) {

    try {
        const jobs = await vrt.getHistory()
        res.status(200).send( {jobs} )
    }
    catch (error) {
        res.status(500).send( {error} )
    }
});

router.get('/test/config', function(req, res, next) {

    vrt.getBasicConfig( (error, data) => {
        res.status(200).send( {error, data} )
    })
});

router.put('/test/config', function(req, res, next) {

    // TODO: sanitize req.body
    vrt.setBasicConfig(req.body, (error, data) => {
        res.status(200).send( {error, data} )
    })
});

// Delete scenario
router.put('/test/scenario', function(req, res, next) {

    // TODO: sanitize req.body
    vrt.deleteScenarioFromBasicConfig(req.body.label, (error, data) => {
        res.status(200).send( {error, data} )
    })
});



// Get scenario by Id
router.get('/test/scenario/:id', async function(req, res) {

    try {

        const data = await vrt.getScenarioById(req.params.id)
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

        const data = await vrt.getScenarios()
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

        const data = await vrt.createScenario(req.body)
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

        const data = await vrt.updateScenario(req.params.id, req.body)
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
        const data = await vrt.deleteScenario(req.params.id)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});


// Get scenario by Id
router.get('/test/viewport/:id', async function(req, res) {

    try {

        const data = await vrt.getViewportById(req.params.id)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Get scenarios
router.get('/test/viewports', async function(req, res) {

    try {

        const data = await vrt.getViewports()
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Create scenario
router.post('/test/viewport', async function(req, res) {

    try {

        const data = await vrt.createViewport(req.body)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Update scenario
router.put('/test/viewport/:id', async function(req, res) {

    try {

        const data = await vrt.updateViewport(req.params.id, req.body)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});

// Delete scenario
router.delete('/test/viewport/:id', async function(req, res) {

    try {
        const data = await vrt.deleteViewport(req.params.id)
        res.status(200).send( {data} )
    }
    catch (error) {
        console.error('[API] Error: ' + req.path, error)
        res.status(500).send( {error: 'Error occurs at ' + req.path} )
    }
});



module.exports = router;
