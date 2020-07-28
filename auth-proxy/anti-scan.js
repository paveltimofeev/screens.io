module.exports = (allowedHost) => {
  return (req, res, next) => {

    if ( allowedHost && allowedHost !== req.headers.origin ) {
      res.status(404).send();
    }
    else {
      next();
    }
  }
}
