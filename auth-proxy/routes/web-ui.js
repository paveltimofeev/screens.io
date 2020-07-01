const express = require('express');
const router = express.Router();
const {
    clearHeaders, checkAuth, signup, signin, signout,
    changePassword, getAccountInfo, updateAccountInfo, deleteAccount
} = require('../app_logic/utils');


router.get('/login', (req, res) => {
    var {user} = req.signedCookies;
    res.render('index', {user, message:''})
})

router.post('/signup', async (req,res) => {

try {
    const userData = await signup(req, res)
    res.render('index', { message: 'Signed up successfully', user: userData.user})
}
catch ( error ) {
    res.render( 'index', { message : 'Sign-Up failed', user : '' } )
}
})

router.post('/signin', async (req,res) => {

try {
    const userData = await signin(req, res)
    res.render('index', { message: 'Logged in successfully', user: userData.user})
}
catch ( error ) {
    res.render( 'index', { message : 'Login failed', user : '' } )
}

});

router.post('/signout', (req,res) => {

signout(req, res, (err) => {
    res.render('index', { message: 'Logged out', user: ''})
    })
});


module.exports = router;
