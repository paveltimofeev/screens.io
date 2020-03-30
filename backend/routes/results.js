var express = require('express');
var router = express.Router();
var vrt = require('../app_logic/vrt');

router.get('/', function(req, res, next) {
  res.render('results', { data: { report: vrt.getReport() } });
});

module.exports = router;
