
module.exports = (req, res, next) => {

  let origin = req.headers.origin;

  if (
    origin === 'http://localhost:4200' ||
    origin === 'http://localhost:3000' ||
    origin === 'http://localhost:8888'
  ) {

    if (req.method === 'OPTIONS' ) {

      console.log( 'allow CORS for', origin );

      res.append( 'Access-Control-Allow-Origin', origin );
      res.append( 'Access-Control-Allow-Methods', 'GET, PUT, HEAD, OPTIONS, POST, PATCH, DELETE' );
      res.append( 'Access-Control-Allow-Headers', 'Content-Type' );
      res.append( 'Access-Control-Allow-Credentials', 'true' );
    }

  }
  next();
}
