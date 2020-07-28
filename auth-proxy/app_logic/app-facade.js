const auth = require('./auth');
const manage = require('./manage');
const utils = require('./utils');


module.exports = {

  auth: auth,
  utils: utils,
  manage: manage,

  signup: auth.signup,
  signin: auth.signin,
  signout: auth.signout,
  checkAuth: auth.checkAuth,

  clearHeaders: utils.clearHeaders,

  changePassword: manage.changePassword,
  getAccountInfo: manage.getAccountInfo,
  updateAccountInfo: manage.updateAccountInfo,
  deleteAccount: manage.deleteAccount
};
