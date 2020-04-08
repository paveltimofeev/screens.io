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


const port = 8888;
const backend = 'http://localhost:3000';
const proxyPath = '/api/*';
const cookieSign = 'secretKey'
const sessionSecret = 'sessionSecret71R369C31V186C12BX'
const sessionCookieName = 'twghtf'
const secureCookie = false                              // HTTPS needs for 'true'
const maxAge = 1000 * 60 * 60 * 10                      // 10h (prune expired entries every 10h)
const allowedCORSHost = 'http://localhost:4200'

process.env.NODE_ENV = 'production'; // Hide stacktrace on error

var app = express();
app.use(logger('dev'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(cookieSign))
app.use(cors(allowedCORSHost));
app.use(clearHeaders(['X-Powered-By']))

/// Configure session storage
/// https://github.com/expressjs/session
app.use(session({
  name: sessionCookieName,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: secureCookie,
    maxAge: maxAge
  },
  store: new MemoryStore({
    checkPeriod: maxAge
  }),
}))

/// Check authorized session
app.use(proxyPath, checkAuth)

/// Proxy backend calls
/// SHOULD BE USED BEFORE(!) express.json()! TO AVOID FREEZING ON POST/PUT REQUESTS
app.use(proxyPath, createProxyMiddleware({
  target: backend,
  changeOrigin: true,
  logLevel:'debug'
}));


/// Needed to parse json body for login/logout
/// SHOULD BE USED AFTER(!) PROXY! TO AVOID FREEZING ON POST/PUT REQUESTS
app.use(express.json())

app.get('/login', (req, res) => {
  var {user} = req.signedCookies;
  res.render('index', {user, loginResult:''})
})

app.post('/login-client', (req,res) => {

  login(req, res,
    (user) => {
      res.status(200).send({user})
    },
    () => {
      res.status(401).send()
    })
});

app.post('/logout-client', (req,res) => {

  logout(req, res, (err) => {
      res.status(200).send(err)
    })
});

app.post('/login', (req,res) => {

  login(req, res,
    (user) => {
      res.render('index', { loginResult: 'Logged in successfully', user})
    },
    () => {
      res.render( 'index', { loginResult : 'Login failed', user : '' } )
    })

});
app.post('/logout', (req,res) => {

  logout(req, res, (err) => {
      res.render('index', { loginResult: 'Logged out', user: ''})
    })
});



app.set('port', port);
var server = http.createServer(app);
server.listen(port);
