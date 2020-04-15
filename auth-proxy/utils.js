const fs = require('fs');
const config = require('./config')
const { model, Schema} = require('mongoose')

const usersListPath = 'users.json'
const maxAge = 1000 * 60 * 60 * 10                      // 10h (prune expired entries every 10h)

const clearHeaders = (headers) => {

  return (req, res, next) => {

    headers.forEach(header => { res.set(header, '') })
    next()
  }
}

const checkAuth = (req, res, next) => {

  if (!req.session.authorized && req.method !== 'OPTIONS') {

    const {method, originalUrl, hostname, ip} = req;
    console.error(' > Not authorized request:',
      {method, originalUrl, hostname, ip});

    let err = new Error('Not authorized')
    err.status = 401
    next(err)
  }
  else {
    next();
  }
}

const login = async (req, res, success, fail) => {

  const user = req.body.user;
  const password = req.body.password;

  const userCheck = _isValidUser(user);
  const passwordCheck = _isValidPassword(password);

  if (!userCheck || !passwordCheck) {
    console.log('Username check:', _isValidUser(user));
    console.log('Password check:', _isValidUser(password));
    logout(req, res, fail);

    let error = new Error('Invalid username or password');
    error.status = 403;
    throw error;
  }

  try {

    const userData = await getUser(user, password)

    if (!userData) {
      let error = new Error('Wrong username or password');
      error.status = 403;
      throw error;
    }

    if (userData.user === user && userData.password === password) {

      console.log('Login success ', `${userData.tenant}/${userData.user}`);

      req.session.authorized = true;
      req.session.user = userData.user;
      req.session.tenant = userData.tenant;

      res.cookie('user', user, {signed:true, sameSite:true, maxAge: config.maxAge});

      return {
        user: userData.user,
        tenant: userData.tenant
      };

    } else {

      let error = new Error('Stored user/password does not match provided!');
      error.status = 403;
      throw error;
    }

  }
  catch ( error ) {

    console.error('[Utils] ERROR getUser', error)
    throw error;
  }
}

const logout = (req, res, cb) => {

  console.log('Logout. Destroy session of user:', req.session.user);

  req.session.authorized = false;
  req.session.user = undefined;
  res.clearCookie('user').clearCookie('session');

  req.session.destroy(function(err) {

    if (err) {
      console.error('[Utils.logout] ERROR session destroy', err)
    }

    if (cb) {
      cb( err );
    }
  })
}

const _isValidUser = (val) => {

  var illegalChars = /\W/; // allow letters, numbers, and underscores

  return val !== null &&
    val !== undefined &&
    typeof(val) === 'string' &&
    val.length > 3 &&
    !illegalChars.test(val)
};

const _isValidPassword = (val) => {

  var illegalChars = /\W/; // allow letters, numbers, and underscores

  return val !== null &&
    val !== undefined &&
    typeof(val) === 'string' &&
    val.length > 3 &&
    !illegalChars.test(val)
};


const UserModel = new model(config.dbUsersCollection, new Schema({
  user: String,
  password: String,
  enabled: Boolean,
  tenant: String
}));

const convertToObject = (entry) => {

  delete entry._id;
  delete entry.__v;
  return JSON.parse(JSON.stringify(entry))
}

const getUser = async (user, password) => {

  try {

    const record = await UserModel.findOne( {user, password, enabled: true} );

    if (record) {
      return convertToObject( record );
    }
    else {
      return undefined;
    }
  }
  catch (error) {
    console.error('[Utils] ERROR getUser', error)
  }
}


module.exports = {
  clearHeaders,
  checkAuth,
  login,
  logout
}
