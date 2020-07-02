const express = require('express');
const router = express.Router();
const {
    checkAuth, signout,
    getAccountInfo, updateAccountInfo, deleteAccount, changePassword
} = require('../app_logic/utils');


/// Check authorized session for all requests on this sub-route
router.use('/', checkAuth)

/// getAccountInfo
router.get('/account', async (req,res) => {

    try {
      const result = await getAccountInfo(req, res)
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
        const result = await updateAccountInfo(req, res)
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

        const result = await deleteAccount(req, res)
        await signout;
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

        const result = await changePassword(req, res)
        res.status(result.status).send({})
    }
    catch(error) {
        console.log('ERROR changePassword', error)
        res.status(500).send( { message: 'Operation failed' })
    }
})


module.exports = router;
