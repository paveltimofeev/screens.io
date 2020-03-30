var express = require('express');
var router = express.Router();
var vrt = require('../app_logic/vrt');

router.get('/test/run', function(req, res, next) {
    res.redirect('/');
});

router.post('/test/run', function(req, res, next) {
    
    var opts = {...req.body}
    vrt.run(opts);
    res.render('test_run', { data: req.body });
});

router.post('/test/approve/:runid', function(req, res, next) {
    vrt.approve();
    res.render('test_run', { data: req.body });
});

router.get('/test/report', function(req, res, next) {
  res.status(200).send( vrt.getReport() )
});


module.exports = router;
