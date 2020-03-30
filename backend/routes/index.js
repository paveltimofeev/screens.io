var express = require('express');
var router = express.Router();
var vrt = require('../app_logic/vrt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Visual Regression Testing',
    results: vrt.history() 
  });
});

module.exports = router;
