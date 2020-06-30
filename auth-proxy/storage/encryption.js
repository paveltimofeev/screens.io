/// Unsalted SHA is not secure. Use bcrypt
/// https://www.npmjs.com/package/bcryptjs
const bcryptjs = require('bcryptjs');
const util = require('util');


const _hashPassword = function (plainPassword, next) {

  bcryptjs.genSalt(10, function(err, salt) {
    bcryptjs.hash( plainPassword, salt, next);
  });
};
const _hashPasswordPromise = util.promisify(_hashPassword);


const hashPassword = async (plainPassword) => {
  return await _hashPasswordPromise(plainPassword);
};


const comparePasswords = async (plainPass, hash) => {
  return await bcryptjs.compare(plainPass, hash);
};


module.exports = {
  hashPassword: hashPassword,
  comparePasswords: comparePasswords
}
