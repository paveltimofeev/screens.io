const auth = require('./auth');
const manage = require('./manage');
const utils = require('./utils');


module.exports = {

  signup: auth.signup,
  signin: auth.signin,
  signout: auth.signout,

  checkAuth: utils.checkAuth,
  clearHeaders: utils.clearHeaders,

  changePassword: manage.changePassword,
  getAccountInfo: manage.getAccountInfo,
  updateAccountInfo: manage.updateAccountInfo,
  deleteAccount: manage.deleteAccount
};
