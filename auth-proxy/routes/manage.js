const express = require('express');
const router = express.Router();
const {
    clearHeaders, checkAuth, signup, signin, signout, 
    changePassword, getAccountInfo, updateAccountInfo, deleteAccount
} = require('./../utils');


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

router.delete('/account', async (req,res) => {

try {

    const result = await deleteAccount(req, res)
    res.status(result.status).send({})
}
catch(error) {
    console.log('ERROR deleteAccount', error)
    res.status(500).send( { message: 'Operation failed' })
}
})

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
