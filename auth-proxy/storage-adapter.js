const { connect, model, Schema} = require('mongoose')


class StorageAdapter {

  constructor (usersCollectionName, usersCollectionSchema) {

    this.userModel = new model(
      usersCollectionName,
      new Schema({
        "tenant": String,
        "user":     { "type": String, "required": true, "unique": true },
        "password": { "type": String, "required": true },
        "enabled": Boolean
      })
    );
  }

  async createUser (user, password) {

    const account = new this.userModel({
      user,
      password,
      tenant: 'test-tenant',
      enabled: true
    })

    return await account.save()
  }

  async getUser (user, password) {

    try {

      const record = await this.userModel.findOne( { user, password, enabled : true } );

      if( record ) {
        return this.convertToObject( record );
      }
      else {
        return undefined;
      }

    } catch ( error ) {
      console.error( '[Utils] ERROR getUser', error )
    }
  }

  async updateUserPassword (user, currentPassword, newPassword) {

    const record = await this.userModel.findOne( { user, password:currentPassword } );
    if( record ) {
      record.password = newPassword;
      await record.save();
      return { status: 200 }
    }
    else {
      return { status: 404 }
    }
  }

    convertToObject (entry) {

    delete entry._id;
    delete entry.__v;
    return JSON.parse(JSON.stringify(entry))
  }
}


const createStorageAdapter = (usersCollection) => {

  return new StorageAdapter(usersCollection)
}

const connectToDb = async (connectionString) => {

  console.log('[Start proxy] Connecting to db...')

  await connect(
    connectionString,
    {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    });

  console.log('[Start proxy] Connected')
}


module.exports = {
  createStorageAdapter,
  connectToDb
}
