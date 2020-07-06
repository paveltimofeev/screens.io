const express = require('express');
const router = express.Router();
const appFacade = require('../app_logic/app-facade');


router.get('/login', (req, res) => {
    var {user} = req.signedCookies;
    res.render('index', {user, message:''})
})

router.post('/signup', async (req,res) => {

    try {
        const userData = await appFacade.signup(req, res)
        res.render('index', { message: 'Signed up successfully', user: userData.user})
    }
    catch ( error ) {
        res.render( 'index', { message : 'Sign-Up failed', user : '' } )
    }
})

router.post('/signin', async (req,res) => {

    try {
        const userData = await appFacade.signin(req, res)
        res.render('index', { message: 'Logged in successfully', user: userData.user})
    }
    catch ( error ) {
        res.render( 'index', { message : 'Login failed', user : '' } )
    }

});

router.post('/signout', (req,res) => {

    appFacade.signout(req, res, (err) => {
        res.render('index', { message: 'Logged out', user: ''})
    })
});


module.exports = router;
