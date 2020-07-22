
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
  getAndValidateUserFromSession,
  getAndValidatePasswordFromBody,
  _isValidUser,
  _isValidEmail,
  _isValidPassword
}
