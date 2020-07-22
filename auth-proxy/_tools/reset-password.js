const { model } = require('mongoose');
const config = require('../config');
const { userSchema } = require('./../models/user');
const storage = require('../storage/storage-adapter');
const encryption = require('../storage/encryption');
const userModel = new model(config.dbUsersCollection, userSchema);


const email = 'guest@screen.io';
const password = 'GUEST2020';


const conn = storage.connectToDb(config.storageConnectionString)
  .then( async () => {

    console.log('connected');

    await userModel.findOne({email}).then(async user => {

      console.log('user to update', user.toObject());

      user.passwordHash = await encryption.hashPassword( password );
      await user.save();
    });

    conn.close();
  });
