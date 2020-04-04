var express = require('express');
var router = express.Router();
var vrt = require('../app_logic/vrt');

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

router.post('/test/run', function(req, res, next) {

    var opts = { ...req.body }; // TODO: sanitize body

    console.log(opts);

    vrt.run(opts, (error, data) => {
        res.status(200).send( { error, data } )
    })
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

router.get('/test/report/:jobId', function(req, res, next) {

    const jobId = req.params.jobId; // TODO: sanitize

    vrt.getReport(jobId, (error, report) => {
        res.status(200).send( {error, report} );
    })
});

router.get('/test/history', function(req, res, next) {

    vrt.getHistory( (error, jobs) => {
        res.status(200).send( {error, jobs} )
    })
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


module.exports = router;
