
module.exports = (req, res, next) => {

  console.log(req.headers.origin);

  let origin = req.headers.origin;

  if (
    origin === 'http://localhost:4200' ||
    origin === 'http://localhost:3000'
  ) {

    res.append('Access-Control-Allow-Origin', origin);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
  }
  next();
}
