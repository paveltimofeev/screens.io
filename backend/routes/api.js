var express = require('express');
var router = express.Router();
var vrt = require('../app_logic/vrt');

/*
    API CALLS

    /api/test/run           <-  { data: {jobId} }
    /api/approve/:runid
    /api/test/report
    /api/test/history
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

    const jobId = req.param('jobId'); // TODO: sanitize

    vrt.getReport(jobId, (error, report) => {
        res.status(200).send( {error, report} );
    })
});

router.get('/test/history', function(req, res, next) {

    vrt.getHistory( (errors, jobs) => {
        res.status(200).send( {errors, jobs} )
    })
});


module.exports = router;
