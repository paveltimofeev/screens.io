const fs = require('fs');
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


const isValidUser = (val) => {

  var illegalChars = /\W/; // allow letters, numbers, and underscores

  return val !== null &&
    val !== undefined &&
    typeof(val) === 'string' &&
    val.length > 3 &&
    !illegalChars.test(val)
};

const isValidPassword = (val) => {

  var illegalChars = /\W/; // allow letters, numbers, and underscores

  return val !== null &&
    val !== undefined &&
    typeof(val) === 'string' &&
    val.length > 3 &&
    !illegalChars.test(val)
};

const login = (req, res, success, fail) => {

  const user = req.body.user;
  const password = req.body.password;

  const userCheck = isValidUser(user);
  const passwordCheck = isValidPassword(password);

  if (!userCheck || !passwordCheck) {
    console.log('Username check:', isValidUser(user));
    console.log('Password check:', isValidUser(password));
    logout(req, res, fail);
    return;
  }

  const users = JSON.parse(fs.readFileSync(usersListPath, 'utf8')); // TODO: async, cache, error catch?

  if (users && users[user] === password) {

    console.log('Login success. user:', user);

    req.session.authorized = true;
    req.session.user = user;
    res.cookie('user', user, {signed:true, sameSite:true, maxAge: maxAge});

    success(user);
  }
  else {

    console.log('Login failed. Bad password for user or user not found:', user);
    logout(req, res, fail);
  }
}

const logout = (req, res, cb) => {

  console.log('Logout. Destroy session of user:', req.session.user);

  req.session.authorized = false;
  req.session.user = undefined;
  req.session.destroy(function(err) {

    res
      .clearCookie('user')
      .clearCookie('session');

    cb(err);
  })
}

module.exports = { clearHeaders, checkAuth, login, logout }
