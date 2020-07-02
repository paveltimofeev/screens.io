
class UIError {

  static throw (uiMessage, extraInfo = null) {

    let err = new Error(uiMessage)
    err.extraInfo = extraInfo
    err.uiError = { message: uiMessage }
    throw err;
  }
}

module.exports = {
  UIError
}
