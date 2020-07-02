var express = require('express');
var router = express.Router();
var vrt = require('../app_logic/vrt');

router.get('/:jobId', function(req, res, next) {

  res.render('results');
});

module.exports = router;
