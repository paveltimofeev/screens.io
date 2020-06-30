const { model } = require('mongoose');
const config = require('../config');
const { userSchema } = require('./../models/user');
const storage = require('../storage/storage-adapter');
const encription = require('../storage/encryption');

const userModel = new model(config.dbUsersCollection, userSchema);

storage.connectToDb(config.dbConnectionString)
  .then( async () => {

    console.log('connected');

    await userModel.find({}).then(async users => {

      return await users
        .forEach(async user => {

          if (user.password) {
            console.log(' - updating hash', user._id);
            user.passwordHash = await encription.hashPassword( user.password );
          }

          if (user.password) {
            console.log( ' - clean out password', user._id );
            user.password = null;
            delete user.password;
          }

          await user.save()
        })
    });
  });
