const express = require('express');
const router = express.Router();
const appFacade = require('../app_logic/app-facade');


/// Check authorized session for all requests on this sub-route
router.use('/', appFacade.checkAuth)


/// getAccountInfo
router.get('/account', async (req,res) => {

    try {
      const result = await appFacade.getAccountInfo(req, res)
      res.status(result.status).send(result.data)
    }
    catch(error) {
      console.log('ERROR getAccountInfo', error)
      res.status(500).send( { message: 'Operation failed' })
    }
})

/// updateAccountInfo
router.put('/account', async (req,res) => {

    try {
        const result = await appFacade.updateAccountInfo(req, res)
        res.status(result.status).send(result.data)
    }
    catch(error) {
        console.log('ERROR updateAccountInfo', error)
        res.status(500).send( { message: 'Operation failed' })
    }
})

/// deleteAccount
router.delete('/account', async (req,res) => {

    try {

        const result = await appFacade.deleteAccount(req, res)
        await appFacade.signout;
        res.status(result.status).send({})
    }
    catch(error) {
        console.log('ERROR deleteAccount', error)
        res.status(500).send( { message: 'Operation failed' })
    }
})

/// changePassword
router.put('/account/password', async (req,res) => {

    try {

        const result = await appFacade.changePassword(req, res)
        res.status(result.status).send({})
    }
    catch(error) {
        console.log('ERROR changePassword', error)
        res.status(500).send( { message: 'Operation failed' })
    }
})


module.exports = router;
