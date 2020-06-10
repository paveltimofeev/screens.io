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
