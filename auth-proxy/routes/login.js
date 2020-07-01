const express = require('express');
const router = express.Router();
const { signup, signin, signout } = require('../app_logic/utils');


router.post('/signup-client', async (req,res) => {

    try {

      const userData = await signup(req, res)
      res.status(200).send({userData})
    }
    catch(error) {

      console.log('ERROR /signup-client', error)
      res.status(200).send( { error: error.uiMessage || 'Login failed' })
    }
});

router.post('/signin-client', async (req,res) => {

try {

    const userData = await signin(req, res)
    res.status(200).send({userData})
}
catch(error) {

    console.log('ERROR /signin-client', error)
    res.status(200).send( { error: error.uiMessage || 'Login failed' })
}
});

router.post('/signout-client', (req,res) => {

signout(req, res, (err) => {
    res.status(200).send(err)
    })
});


module.exports = router;
