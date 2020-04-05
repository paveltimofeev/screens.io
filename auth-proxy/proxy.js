const http = require('http');
const path = require('path');
const fs = require('fs');
const logger = require('morgan');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser')
const session = require('express-session')
var MemoryStore = require('memorystore')(session)


const port = 8888;
const backend = 'http://localhost:3000';
const proxyPath = '/api';
const cookieSign = 'secretKey'
const sessionSecret = 'sessionSecret71R369C31V186C12BX'
const sessionCookieName = 'twghtf'
const secureCookie = false                              // HTTPS needs for 'true'
const maxAge = 1000 * 60 * 60 * 10                      // 10h (prune expired entries every 10h)
const usersListPath = 'users.json'

process.env.NODE_ENV = 'production'; // Hide stacktrace on error

var app = express();
app.use(logger('dev'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(cookieSign))

app.use((req, res, next) => {
  res.set('X-Powered-By', '');
  next()
})

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


app.use(proxyPath, function(req, res, next){

  if (!req.session.authorized) {
    let err = new Error('Not authorized')
    err.status = 401
    next(err)
  }
  else {
    next();
  }
})
app.use(proxyPath, createProxyMiddleware({ target: backend, changeOrigin: true }));


app.get('/login', (req, res) => {
  var {user} = req.signedCookies;
  res.render('index', {user, loginResult:''})
})
app.post('/login', (req,res) => {

  const users = JSON.parse(fs.readFileSync(usersListPath, 'utf8')); // TODO: async?
  const user = req.body.user;

  if (users[user] === req.body.password) {

    console.log('Login success. user:', user);

    req.session.authorized = true;
    req.session.user = user;

    res.cookie('user', user, {signed:true, sameSite:true, maxAge: maxAge});
    res.render('index', { loginResult: 'Logged in successfully', user})
  }
  else {

    console.log('Login failed. user:', user);

    req.session.authorized = false;
    req.session.user = undefined;
    req.session.destroy(function(err) {

      res.render( 'index', { loginResult : 'Login failed', user : '' } )
    });
  }
});
app.post('/logout', (req,res) => {

  console.log('Logout. user:', req.session.user);

  req.session.destroy(function(err) {

    res
      .clearCookie('user')
      .clearCookie('session')
      .render('index', { loginResult: 'Logged out', user: ''})
  })
});



app.set('port', port);
var server = http.createServer(app);
server.listen(port);
