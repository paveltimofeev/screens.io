
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
    let err = new Error('Not authorized')
    err.status = 401
    next(err)
  }
  else {
    next();
  }
}

module.exports = { clearHeaders, checkAuth }
