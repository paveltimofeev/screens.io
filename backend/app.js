const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('./cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const resultsRouter = require('./routes/results');
const mongoose = require('mongoose');

const config = require('./config');


async function connectToDb() {

  try {
    await mongoose.connect(config.storageConnectionString, config.storageOptions);
    console.log('Connected to MongoDb')
  }
  catch (e) {
    console.log('ERROR: Cannot connect to MongoDb', e)
  }
}

connectToDb()


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vrt_data', express.static(path.join(__dirname, 'vrt_data')));

app.use(cors);
app.use((req, res, next) => {

  req.context = {
    userid: req.header('x-auth-proxy-userid'),
    user: req.header('x-auth-proxy-user'),
    tenant: req.header('x-auth-proxy-tenant'),
    username: req.header('x-auth-proxy-username')
  }

  next()
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/results', resultsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
