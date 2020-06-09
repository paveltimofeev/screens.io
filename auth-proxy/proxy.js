const http = require('http');
const path = require('path');
const logger = require('morgan');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const cors = require('./cors');
const {clearHeaders, checkAuth, signup, signin, signout, changePassword, deleteAccount} = require('./utils')
const config = require('./config')
const { connectToDb } = require('./storage-adapter')

process.env.NODE_ENV = 'production'; // Hide stacktrace on error

var app = express();
app.use(logger('dev'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(config.cookieSign))
app.use(cors(config.allowedCORSHost));
app.use(clearHeaders(['X-Powered-By']))

/// Configure session storage
/// https://github.com/expressjs/session
app.use(session({
  name: config.sessionCookieName,
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: config.secureCookie,
    maxAge: config.maxAge
  },
  store: new MemoryStore({
    checkPeriod: config.maxAge
  }),
}))


/// Check authorized session
app.use(config.proxyPath, checkAuth)
app.use('mgt/account', checkAuth)


/// Proxy backend calls
/// SHOULD BE USED BEFORE(!) express.json()! TO AVOID FREEZING ON POST/PUT REQUESTS
app.use(config.proxyPath, createProxyMiddleware({
  target: config.backend,
  changeOrigin: true,
  logLevel:'debug',
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('x-auth-proxy-user', req.session.user);
  }
}));


/// Needed to parse json body for login/logout
/// SHOULD BE USED AFTER(!) PROXY! TO AVOID FREEZING ON POST/PUT REQUESTS
app.use(express.json())

app.put('/manage/account/password', async (req,res) => {

  try {

    const result = await changePassword(req, res)
    res.status(result.status).send({})
  }
  catch(error) {
    console.log('ERROR changePassword', error)
    res.status(500).send( { message: 'Operation failed' })
  }
})

app.delete('/manage/account', async (req,res) => {

  try {

    const result = await deleteAccount(req, res)
    res.status(result.status).send({})
  }
  catch(error) {
    console.log('ERROR deleteAccount', error)
    res.status(500).send( { message: 'Operation failed' })
  }
})

app.post('/signup-client', async (req,res) => {

  try {

    const userData = await signup(req, res)
    res.status(200).send({userData})
  }
  catch(error) {

    console.log('ERROR /signup-client', error)
    res.status(401).send( { message: 'Login failed' })
  }
});
app.post('/signin-client', async (req,res) => {

  try {

    const userData = await signin(req, res)
    res.status(200).send({userData})
  }
  catch(error) {

    console.log('ERROR /signin-client', error)
    res.status(401).send( { message: 'Login failed' })
  }
});
app.post('/signout-client', (req,res) => {

  signout(req, res, (err) => {
      res.status(200).send(err)
    })
});


if (config.showWebUI) {

  app.get('/login', (req, res) => {
    var {user} = req.signedCookies;
    res.render('index', {user, message:''})
  })

  app.post('/signup', async (req,res) => {

    try {
      const userData = await signup(req, res)
      res.render('index', { message: 'Signed up successfully', user: userData.user})
    }
    catch ( error ) {
      res.render( 'index', { message : 'Sign-Up failed', user : '' } )
    }
  })
  app.post('/signin', async (req,res) => {

    try {
      const userData = await signin(req, res)
      res.render('index', { message: 'Logged in successfully', user: userData.user})
    }
    catch ( error ) {
      res.render( 'index', { message : 'Login failed', user : '' } )
    }

  });
  app.post('/signout', (req,res) => {

    signout(req, res, (err) => {
        res.render('index', { message: 'Logged out', user: ''})
      })
  });

}


async function start() {

  try {

    await connectToDb( config.dbConnectionString )

    console.log('[Start proxy] Listening port', config.port)

    app.set('port', config.port);
    var server = http.createServer(app);
    server.listen(config.port);
  }
  catch (error) {
    console.error('[Start proxy] Error', error)
  }
}

start();
