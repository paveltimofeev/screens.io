const { connect, model, Schema} = require('mongoose')


class StorageAdapter {

  constructor (usersCollectionName, usersCollectionSchema) {

    this.userModel = new model(
      usersCollectionName,
      new Schema({
        "tenant":         String,
        "user":           { "type": String, "required": true, "unique": true },
        "password":       { "type": String, "required": true },
        "name":           { "type": String },
        "email":          { "type": String, "required": false, "unique": true },
        "emailConfirmed": { "type": Boolean, "default": false },
        "enabled":        { "type": Boolean, "default": true },
      })
    );
  }

  async createUser (user, email, password) {

    const account = new this.userModel({
      user,
      email,
      password,
      name: user,
      tenant: 'test-tenant'
    })

    return await account.save()
  }

  async getUser (email, password) {

    try {

      const record = await this.userModel.findOne( { email, password, enabled : true } );

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

  /**
   * Get Account Info
   * @param user
   * @returns {Promise<{ user:string, name:string, email:string, emailConfirmed: boolean }>}
   */
  async getAccountInfo (user) {

    try {
      const record = await this.userModel.findOne( { user } );

      if( record ) {
        let { user, name, email, emailConfirmed } = this.convertToObject(record);
        return { user, name, email, emailConfirmed };
      }
      else {
        return undefined;
      }

    } catch ( error ) {
      console.error( '[Utils] ERROR getAccountInfo', error )
    }
  }

  /**
   * Update 'name' and 'email' of user
   * @param user
   * @param password
   * @param accountInfo <{name:string, email:string}>
   * @returns {Promise<{status: number}>}
   */
  async updateAccountInfo (user, password, accountInfo) {

    if (!user || !password || !accountInfo) {
      return { status : 400 }
    }

    const record = await this.userModel.findOne( { user, password } );
    if( record ) {

      record.name = accountInfo.name || record.name;
      record.email = accountInfo.email || record.email;

      await record.save();
      return { status: 200 }
    }
    else {
      return { status: 404 }
    }
  }

  async updateUserPassword (user, currentPassword, newPassword) {

    if (!user || !currentPassword || !newPassword) {
      return { status : 400 }
    }

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

  async deleteUser (user, password) {

    if (!user || !password) {
      return { status : 400 }
    }

    const result = await this.userModel.deleteOne( { user, password } );
    console.log(`delete account "${user}" result`, result)

    if (result.deletedCount > 1) {
      console.error('ERROR: deleteUser - Delete more than one account', { user, password, result })
    }

    return { status: result.ok === 1 && result.deletedCount === 1 ? 200 : 500 }
  }

  convertToObject (entry) {

    if (!entry) {
      return null;
    }

    let obj = entry.toObject();
    delete obj.__v;
    return obj
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
