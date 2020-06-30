const { connect, model, Schema} = require('mongoose')
const { userSchema } = require('./../models/user')
const encryption = require('./encryption')


class StorageAdapter {

  constructor (usersCollectionName) {

    this.userModel = new model(
      usersCollectionName,
      userSchema
    );
  }

  async createUser (user, email, password) {

    const account = new this.userModel({
      user,
      email,
      passwordHash: await encryption.hashPassword(password),
      name: user,
      tenant: 'test-tenant'
    })

    return await account.save()
  }

  async getUser (email, plainPassword) {

    try {

      const record = await this.userModel.findOne( { email, enabled : true } );
      const passwordCheck = await encryption.comparePasswords(plainPassword, record.passwordHash);

      if (passwordCheck !== true) {
        console.log('password check', passwordCheck);
        console.error( '[Utils] ERROR getUser: wrong password. passwordCheck:', passwordCheck );
        return undefined;
      }

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
   * Get User by UserName from storage and compare PasswordHash with provided PlainPassword
   * */
  async passwordCheckByUser(user, plainPassword) {

    const record = await this.userModel.findOne( { user, enabled : true } );
    const passwordCheckByUser = await encryption.comparePasswords(plainPassword, record.passwordHash);
    return passwordCheckByUser === true;
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

    const passwordCorrect = await this.passwordCheckByUser(user, password);
    if (passwordCorrect !== true) {
      return { status: 401 }
    }

    const record = await this.userModel.findOne( { user } );
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

  async updateUserPassword (user, password, newPassword) {

    if (!user || !password || !newPassword) {
      return { status : 400 }
    }

    const passwordCorrect = await this.passwordCheckByUser(user, password);
    if (passwordCorrect !== true) {
      return { status: 401 }
    }

    const record = await this.userModel.findOne( { user } );
    if( record ) {
      record.passwordHash = await encryption.hashPassword(newPassword);
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

    const passwordCorrect = await this.passwordCheckByUser(user, password);
    if (passwordCorrect !== true) {
      return { status: 401 }
    }

    const result = await this.userModel.deleteOne( { user } );
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
