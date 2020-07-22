const express = require('express');
const router = express.Router();
const { version } = require('../package.json');

router.get('/version', (req,res) => {

  res.status(200).send({
    name: 'auth-proxy',
    version: version
  })
});


module.exports = router;
