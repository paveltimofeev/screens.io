const http = require('http');
const path = require('path');
const logger = require('morgan');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const cors = require('./cors');
const appFacade = require('./app_logic/app-facade');
const config = require('./config')
const { connectToDb } = require('./storage/storage-adapter')

const loginRouter = require('./routes/login');
const manageRouter = require('./routes/manage');
const webuiRouter = require('./routes/manage');
const sysRouter = require('./routes/sys');


process.env.NODE_ENV = 'production'; // Hide stacktrace on error

var app = express();

// app.use(logger('dev'))
logger.token('userid', (req) => req.session ? req.session.userid : '-');
app.use(logger('[Request] :method :url :status :res[content-length] - :response-time ms | :userid'));

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(config.cookieSign))
app.use(cors(config.allowedCORSHost));
app.use(appFacade.clearHeaders(['X-Powered-By']))

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


/// Check authorized session for proxied requests
app.use(config.proxyPath, appFacade.checkAuth)


/// Proxy backend calls
/// SHOULD BE USED BEFORE(!) express.json()! TO AVOID FREEZING ON POST/PUT REQUESTS
app.use(config.proxyPath, createProxyMiddleware({
  target: config.backend,
  changeOrigin: true,
  logLevel:'debug',
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('x-auth-proxy-userid', req.session.userid);
    proxyReq.setHeader('x-auth-proxy-user', req.session.user);
    proxyReq.setHeader('x-auth-proxy-tenant', req.session.tenant);
    proxyReq.setHeader('x-auth-proxy-username', req.session.username);
  }
}));


/// Needed to parse json body for login/logout
/// SHOULD BE USED AFTER(!) PROXY! TO AVOID FREEZING ON POST/PUT REQUESTS
app.use(express.json())


/// ROUTES MIDDLEWARE

app.use('/sys', sysRouter);
app.use('/manage', manageRouter);
app.use('/', loginRouter);

if (config.showWebUI) {
  app.use('/', webuiRouter);
}


async function start() {

  let conn;

  try {

    conn = await connectToDb( config.storageConnectionString )

    console.log('[Start proxy] Listening port', config.port)

    app.set('port', config.port);
    var server = http.createServer(app);
    server.listen(config.port);
  }
  catch (error) {
    console.error('[Start proxy] Error', error)
    conn.close()
  }
}

start();
