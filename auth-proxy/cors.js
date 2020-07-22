
module.exports = (allowedHost) => {
  return (req, res, next) => {

    let origin = req.headers.origin;

    if ( origin === allowedHost ) {

      res.append('Access-Control-Allow-Origin', origin);
      res.append('Access-Control-Allow-Methods', 'GET, PUT, HEAD, OPTIONS, POST, PATCH, DELETE');
      res.append('Access-Control-Allow-Headers', 'Content-Type');
      res.append('Access-Control-Allow-Credentials', 'true');
    }

    if (req.method === 'OPTIONS') {
      res.status(200).send()
    }
    else {
      next();
    }
  }
}

