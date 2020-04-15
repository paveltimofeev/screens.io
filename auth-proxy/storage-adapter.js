const { connect, model, Schema} = require('mongoose')


class StorageAdapter {

  constructor (usersCollection) {

    this.userModel = new model(
      usersCollection,
      new Schema({
        tenant: String,
        user: String,
        password: String,
        enabled: Boolean
      })
    );
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
