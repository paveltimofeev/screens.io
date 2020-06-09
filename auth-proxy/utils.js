const config = require('./config')
const { createStorageAdapter } = require('./storage-adapter')

const storage = createStorageAdapter(config.dbUsersCollection, config.dbUsersCollectionSchema)

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

const signup = async (req, res) => {

  console.log('signup', req.body)
  const user = req.body.user;
  const password = req.body.password;

  const userCheck = _isValidUser(user);
  const passwordCheck = _isValidPassword(password);

  if (!userCheck || !passwordCheck) {
    console.log('Username check:', _isValidUser(user));
    console.log('Password check:', _isValidUser(password));

    let error = new Error('Wrong username or password')
    throw error;
  }
  else {

    const userData = await storage.createUser(user, password)

    return {
      user: userData.user,
      tenant: userData.tenant
    }
  }
}

const signin = async (req, res, success, fail) => {

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

    const userData = await storage.getUser(user, password)

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

const changePassword = async (req, res) => {

  const user = req.session.user;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  const userCheck = _isValidUser(user);
  const passwordCheck = _isValidPassword(currentPassword);
  const newPasswordCheck = _isValidPassword(newPassword);

  if (!userCheck || !passwordCheck || !newPasswordCheck || currentPassword === newPassword ) {
    console.log('Username check:', _isValidUser(user));
    console.log('Current password check:', _isValidUser(passwordCheck));
    console.log('New password check:', _isValidUser(newPasswordCheck));
    console.log('Current password equals New password check:', _isValidUser(newPasswordCheck));
    let error = new Error('Invalid username or password');
    error.status = 403;
    throw error;
  }

  try {
    return await storage.updateUserPassword(user, currentPassword, newPassword)
  }
  catch ( error ) {

    console.error('[Utils] ERROR getUser', error)
    throw error;
  }
}

const signout = (req, res, cb) => {

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


module.exports = {
  clearHeaders,
  checkAuth,
  signup,
  signin,
  signout,
  changePassword
}
