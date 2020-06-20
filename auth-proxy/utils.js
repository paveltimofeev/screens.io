const axios = require('axios');
const config = require('./config')
const { createStorageAdapter } = require('./storage/storage-adapter')

const storage = createStorageAdapter(config.dbUsersCollection)


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

  const user = req.body.user;
  const email = (req.body.email||'').toLowerCase();
  const password = req.body.password;

  const userCheck = _isValidUser(user);
  const emailCheck = _isValidEmail(email);
  const passwordCheck = _isValidPassword(password);

  if (!userCheck || !emailCheck || !passwordCheck) {
    console.log('Email check:', _isValidEmail(email));
    console.log('Username check:', _isValidUser(user));
    console.log('Password check:', _isValidUser(password));

    let error = new Error('Wrong username or password')
    throw error;
  }
  else {

    const userData = await storage.createUser(user, email, password)

    console.log('Signup success ', `${userData.tenant}/${userData.user}`);
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

  const emailCheck = _isValidEmail(email);
  const passwordCheck = _isValidPassword(password);

  if (!emailCheck || !passwordCheck) {
    console.log('Email check:', _isValidEmail(email));
    console.log('Password check:', _isValidUser(password));
    signout(req, res, fail);

    let error = new Error('Invalid username or password');
    error.status = 403;
    error.uiMessage = 'Invalid username or password';
    throw error;
  }

  try {

    const userData = await storage.getUser(email, password);

    if (!userData) {
      let error = new Error('Wrong user email or password');
      error.status = 403;
      error.uiMessage = `Wrong user email/password or user '${email}' does not exists`;  
      throw error;
    }

    if (userData.email === email && userData.password === password) {

      console.log('Signin success ', `${userData.tenant}/${userData.user}`);
      _createSessionOnSuccess(req, res, userData);

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

const _createSessionOnSuccess = (req, res, userData) => {

  if ( !userData._id 
    || !userData.user 
    || !userData.email 
    || !userData.tenant 
    || !userData.name
  ) {

    delete userData.password;
    console.error('ERROR createSessionOnSuccess: Invalid user data', userData);
    
    let error = new Error('Invalid user data');
    error.status = 403;
    error.uiMessage = 'Invalid user data';
    throw error;
  }

  req.session.authorized = true;
  req.session.userid = userData._id;
  req.session.user = userData.user;
  req.session.email = userData.email;
  req.session.tenant = userData.tenant;
  req.session.username = userData.name;

  res.cookie('user', userData.user, {signed:true, sameSite:true, maxAge: config.maxAge});
  res.cookie('_id', userData._id, {signed:true, sameSite:true, maxAge: config.maxAge});
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
      'x-auth-proxy-user': userData.user,
      'x-auth-proxy-tenant': userData.tenant,
      'x-auth-proxy-username': userData.name
    }
  };

  await axios(options);
}

const changePassword = async (req, res) => {

  const user = getAndValidateUserFromSession(req);
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  const passwordCheck = _isValidPassword(currentPassword);
  const newPasswordCheck = _isValidPassword(newPassword);

  if (!passwordCheck || !newPasswordCheck || currentPassword === newPassword ) {

    console.log('Current password check:', _isValidPassword(passwordCheck));
    console.log('New password check:', _isValidPassword(newPasswordCheck));
    console.log('Current password equals New password check:', _isValidPassword(newPasswordCheck));
    let error = new Error('Invalid username or password');
    error.status = 403;
    throw error;
  }

  try {
    return await storage.updateUserPassword(user, currentPassword, newPassword)
  }
  catch ( error ) {

    console.error('[Utils] ERROR updateUserPassword', error)
    throw error;
  }
}


const getAndValidateUserFromSession = (req) => {

  const user = req.session.user;
  const userCheck = _isValidUser(user);
  if (!userCheck) {
    let error = new Error('Invalid user or password');
    error.status = 403;
    throw error;
  }

  return user;
}

const getAndValidatePasswordFromBody = (req, fieldName) => {

  const password = req.body[fieldName||'password'];
  const passwordCheck = _isValidPassword(password);

  if (!passwordCheck) {
    let error = new Error('Invalid user or password');
    error.status = 403;
    throw error;
  }

  return password;
}

const getAccountInfo = async(req, res) => {

  const user = getAndValidateUserFromSession(req);

  try {
    return {
      data: await storage.getAccountInfo(user),
      status: 200
    }
  }
  catch ( error ) {
    console.error('[Utils] ERROR getAccountInfo', error)
    throw error;
  }
}

const updateAccountInfo = async(req, res) => {

  const user = getAndValidateUserFromSession(req);
  const password = getAndValidatePasswordFromBody(req, 'password');

  try {
    return await storage.updateAccountInfo(user, password, req.body);
  }
  catch ( error ) {
    console.error('[Utils] ERROR updateAccountInfo', error)
    throw error;
  }
}

const deleteAccount = async (req, res) => {

  const user = getAndValidateUserFromSession(req);
  const password = getAndValidatePasswordFromBody(req, 'password');

  try {
    return await storage.deleteUser(user, password)
  }
  catch ( error ) {
    console.error('[Utils] ERROR deleteUser', error)
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

const _isValidEmail = (val) => {

  var legal = /^.+@.+\..+$/;

  return val !== null &&
    val !== undefined &&
    typeof(val) === 'string' &&
    val.length > 3 &&
    legal.test(val)
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
  changePassword,
  getAccountInfo,
  updateAccountInfo,
  deleteAccount
}
