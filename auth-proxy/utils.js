const fs = require('fs');
const usersListPath = 'users.json'
const maxAge = 1000 * 60 * 60 * 10                      // 10h (prune expired entries every 10h)

const clearHeaders = (headers) => {

  return (req, res, next) => {

    console.log(' > Clear headers ', headers);
    headers.forEach(header => { res.set(header, '') })
    next()
  }
}

const checkAuth = (req, res, next) => {

  console.log(' > Check if user is authorized');

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

const login = (req, res, success, fail) => {


  const users = JSON.parse(fs.readFileSync(usersListPath, 'utf8')); // TODO: async?
  const user = req.body.user;         // TODO: sanitize username
  const password = req.body.password; // TODO: sanitize password

  if (users[user] === password) {

    console.log('Login success. user:', user);

    req.session.authorized = true;
    req.session.user = user;

    res.cookie('user', user, {signed:true, sameSite:true, maxAge: maxAge});

    success(user)
  }
  else {

    console.log('Login failed. user:', user);

    req.session.authorized = false;
    req.session.user = undefined;
    req.session.destroy(function(err) {
      fail()
    });
  }


}

const logout = (req, res, cb) => {

  console.log('Logout. user:', req.session.user);

  req.session.destroy(function(err) {

    res
      .clearCookie('user')
      .clearCookie('session');

    cb(err);
  })
}

module.exports = { clearHeaders, checkAuth, login, logout }
