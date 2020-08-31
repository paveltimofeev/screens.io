var express = require('express');
var router = express.Router();
var vrt = require('../../domain/vrt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Visual Regression Testing'
  });
});

router.get('/configuration', function(req, res, next) {
  res.render('configuration');
});

module.exports = router;
