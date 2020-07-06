const express = require('express');
const router = express.Router();
const appFacade = require('../app_logic/app-facade');


router.post('/signup-client', async (req,res) => {

    try {

      const userData = await appFacade.signup(req, res)
      res.status(200).send({userData})
    }
    catch(error) {

      console.log('ERROR /signup-client', error)
      res.status(200).send( { error: error.uiMessage || 'Login failed' })
    }
});


router.post('/signin-client', async (req,res) => {

    try {

        const userData = await appFacade.signin(req, res)
        res.status(200).send({userData})
    }
    catch(error) {

        console.log('ERROR /signin-client', error)
        res.status(200).send( { error: error.uiMessage || 'Login failed' })
    }
});


router.post('/signout-client', (req,res) => {

    appFacade.signout(req, res, (err) => {
        res.status(200).send(err)
    })
});


module.exports = router;
