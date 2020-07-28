const axios = require('axios');
const config = require('./configuration');

const utils = require('./utils');
const { createStorageAdapter } = require('../storage/storage-adapter');
const storage = createStorageAdapter(config.dbUsersCollection);

const log = (message, params, params2) => {

  if (params2) {
    console.log( '[AUTH] ' + message, params, params2);
    return
  }

  if(params) {
    console.log( '[AUTH] ' + message, params);
    return
  }

  console.log( '[AUTH] ' + message);
};

const error = (message, params) => {
  console.error('[AUTH] ERROR ' + message, params);
};

const signup = async (req, res) => {

  const user = req.body.user;
  const email = (req.body.email||'').toLowerCase();
  const password = req.body.password;

  const userCheck = utils._isValidUser(user);
  const emailCheck = utils._isValidEmail(email);
  const passwordCheck = utils._isValidPassword(password);

  if (!userCheck || !emailCheck || !passwordCheck) {
    log('Email check:', utils._isValidEmail(email));
    log('Username check:', utils._isValidUser(user));
    log('Password check:', utils._isValidUser(password));

    throw new Error('Wrong username or password')
  }
  else {

    const userData = await storage.createUser(user, email, password)

    log('Signup success ', `${userData.tenant}/${userData.user}`);
    _createSessionOnSuccess(req, res, userData);
    await _setupNewUser(userData);

    return {
      user: userData.user,
      tenant: userData.tenant
    }
  }
}

const signin = async (req, res, success, fail) => {

  const email = (req.body.email||'').toLowerCase();
  const password = req.body.password;

  const emailCheck = utils._isValidEmail(email);
  const passwordCheck = utils._isValidPassword(password);

  log('Signin. Input data validation', {emailCheck, passwordCheck});

  if (!emailCheck || !passwordCheck) {
    log('Email check:', utils._isValidEmail(email));
    log('Password check:', utils._isValidUser(password));
    signout(req, res, fail);

    let error = new Error('Invalid username or password');
    error.status = 403;
    error.uiMessage = 'Invalid username or password';
    throw error;
  }

  try {

    const userData = await storage.getUser(email, password);

    if (!userData) {
      error('Signin. No userData for this email and password.');
      let error = new Error('Incorrect username or password');
      error.status = 403;
      error.uiMessage = `Incorrect username or password`;
      throw error;
    }

    if (userData.email === email) {

      log('Signin successfylly', `${userData.tenant}/${userData.user}`);
      _createSessionOnSuccess(req, res, userData);

      return {
        user: userData.user,
        tenant: userData.tenant
      };

    } else {

      let error = new Error('Stored user email does not match provided!');
      error.status = 403;
      throw error;
    }

  }
  catch ( error ) {

    error('getUser', error)
    throw error;
  }
}

const signout = (req, res, cb) => {

  log('Signout. Destroy session of user:', req.session.user);

  req.session.authorized = false;
  req.session.user = undefined;
  res.clearCookie('user')
    .clearCookie('session')
    .clearCookie(config.sessionCookieName);

  req.session.destroy(function(err) {

    if (err) {
      error('session destroy', err)
    }

    if (cb) {
      cb( err );
    }
  })
};

const checkAuth = (req, res, next) => {

  if (!req.session.authorized && req.method !== 'OPTIONS') {

    const {method, originalUrl, hostname, ip} = req;
    error(`Not authorized request ${originalUrl}:`, {method, originalUrl, hostname, ip});

    signout(req, res, () => {
      res.status(401).send('Not authorized');
    });
  }
  else {
    next();
  }
}


const _createSessionOnSuccess = (req, res, userData) => {

  if ( !userData._id
    || !userData.user
    || !userData.email
    || !userData.tenant
    || !userData.name
  ) {

    delete userData.password;
    error('createSessionOnSuccess: Invalid user data', userData);

    let error = new Error('Invalid user data');
    error.status = 403;
    error.uiMessage = 'Invalid user data';
    throw error;
  }

  // req.session.regenerate(function(err) {});

  req.session.authorized = true;
  req.session.userid = userData._id.toString();
  req.session.user = userData.user;
  req.session.email = userData.email;
  req.session.tenant = userData.tenant;
  req.session.username = userData.name;

  res.cookie('user', userData.user, utils.getCookieOpts());
  res.cookie('_id', userData._id, utils.getCookieOpts());
}

const _setupNewUser = async (userData) => {

  /// POST `${config.backend}/user/initialize` + retries
  ///  ('x-auth-proxy-user', userData.user)
  ///  ('x-auth-proxy-tenant', userData.tenant)
  ///  ('x-auth-proxy-username', userData.username)

  const options = {
    method: 'POST',
    url: `${config.backend}/api/user/initialize`,
    headers: {
      'x-auth-proxy-userid': userData._id.toString(),
      'x-auth-proxy-user': userData.user,
      'x-auth-proxy-tenant': userData.tenant,
      'x-auth-proxy-username': userData.name
    }
  };

  const response = await axios(options);
}


module.exports = {
  signup,
  signin,
  signout,
  checkAuth
};
