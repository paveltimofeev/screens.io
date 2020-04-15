const http = require('http');
const path = require('path');
const logger = require('morgan');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const cors = require('./cors');
const {clearHeaders, checkAuth, login, logout} = require('./utils')
const mongoose = require('mongoose')
const config = require('./config')

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

app.get('/login', (req, res) => {
  var {user} = req.signedCookies;
  res.render('index', {user, loginResult:''})
})

app.post('/login-client', async (req,res) => {

  try {

    const userData = await login(req, res)
    res.status(200).send({userData})
  }
  catch(error) {

    console.log('ERROR /login-client', error)
    res.status(401).send( { message: 'Login failed' })
  }

});
app.post('/logout-client', (req,res) => {

  logout(req, res, (err) => {
      res.status(200).send(err)
    })
});

app.post('/login', async (req,res) => {

  try {
    const userData = await login(req, res)
    res.render('index', { message: 'Logged in successfully', user: userData})
  }
  catch ( error ) {
    res.render( 'index', { message : 'Login failed', user : '' } )
  }

});
app.post('/logout', (req,res) => {

  logout(req, res, (err) => {
      res.render('index', { loginResult: 'Logged out', user: ''})
    })
});

async function start() {

  try {

    console.log('[Start proxy] Connecting to db...')

    await mongoose.connect(
      config.dbConnectionString,
      {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
      });

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
