
module.exports = (allowedHost) => {
  return (req, res, next) => {

    console.log('check CORS for ', req.method)

    let origin = req.headers.origin;

    if ( origin === allowedHost ) {

      res.append('Access-Control-Allow-Origin', origin);
      res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.append('Access-Control-Allow-Headers', 'Content-Type');
      res.append('Access-Control-Allow-Credentials', 'true');
    }
    next();
  }
}

