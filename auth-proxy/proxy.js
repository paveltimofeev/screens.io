const http = require('http');
const path = require('path');
const logger = require('morgan');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const request = require('request')
var proxy = require('express-http-proxy');
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

app.use(express.json())
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
app.use(proxyPath, createProxyMiddleware({
  target: backend,
  changeOrigin: true,
  logLevel:'debug',
  router: {
    'localhost:4200': 'http://localhost:8888'
  }
}));

// app.get(proxyPath, function (req, res) {
//   var target = `${backend}${req.originalUrl}`;
//   console.log('proxy GET', target)
//   req.pipe(request.get(target)).pipe(res);
// });
// app.post(proxyPath, function (req, res) {
//
//   var target = `${backend}${req.originalUrl}`;
//   var body = req.body;
//   var headers = req.headers
//   console.log('proxy POST', {target, body, headers})
//   req.pipe(request.post(target, {body, headers })).pipe(res);
// });

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

// TODO: sanitize username & password
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
