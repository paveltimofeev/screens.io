var express = require('express');
var router = express.Router();
var vrt = require('../app_logic/vrt');

/*
    API CALLS

    /api/test/run           <-  { data: {jobId} }
    /api/approve/:jobId     <-  { status: 'approved' }
    /api/test/report/:jobId <-  { error, report }
    /api/test/history       <-  { error, jobs }
    /api/test/config        <-  { error, data }
*/

router.post('/test/run', function(req, res, next) {

    var opts = {...req.body}
    let jobId = vrt.run(opts);
    res.status(200).send( { data: {jobId} } );
});

router.post('/test/approve/:jobId', function(req, res, next) {

    vrt.approve();
    res.status(200).send( {status: 'approved'} );
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


module.exports = router;
