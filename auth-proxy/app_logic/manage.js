const config = require('./configuration');
const utils = require('./utils');
const { createStorageAdapter } = require('../storage/storage-adapter');
const storage = createStorageAdapter(config.dbUsersCollection);


const changePassword = async (req, res) => {

  const user = utils.getAndValidateUserFromSession(req);
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  const passwordCheck = utils._isValidPassword(currentPassword);
  const newPasswordCheck = utils._isValidPassword(newPassword);

  if (!passwordCheck || !newPasswordCheck || currentPassword === newPassword ) {

    console.log('Current password check:', utils._isValidPassword(passwordCheck));
    console.log('New password check:', utils._isValidPassword(newPasswordCheck));
    console.log('Current password equals New password check:', utils._isValidPassword(newPasswordCheck));
    let error = new Error('Invalid username or password');
    error.status = 403;
    throw error;
  }

  try {
    return await storage.updateUserPassword(user, currentPassword, newPassword)
  }
  catch ( error ) {

    console.error('[Utils] ERROR updateUserPassword', error)
    throw error;
  }
}

const getAccountInfo = async(req, res) => {

  const user = utils.getAndValidateUserFromSession(req);

  try {
    return {
      data: await storage.getAccountInfo(user),
      status: 200
    }
  }
  catch ( error ) {
    console.error('[Utils] ERROR getAccountInfo', error)
    throw error;
  }
}

const updateAccountInfo = async(req, res) => {

  const user = utils.getAndValidateUserFromSession(req);
  const password = utils.getAndValidatePasswordFromBody(req, 'password');

  try {
    return await storage.updateAccountInfo(user, password, req.body);
  }
  catch ( error ) {
    console.error('[Utils] ERROR updateAccountInfo', error)
    throw error;
  }
}

const deleteAccount = async (req, res) => {

  const user = utils.getAndValidateUserFromSession(req);
  const password = utils.getAndValidatePasswordFromBody(req, 'password');

  try {
    return await storage.deleteUser(user, password)
  }
  catch ( error ) {
    console.error('[Utils] ERROR deleteUser', error)
    throw error;
  }
}


module.exports = {

  changePassword,
  getAccountInfo,
  updateAccountInfo,
  deleteAccount
};
