const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    tenant:         { type: String, required: false, unique: true },
    user:           { type: String, required: true, unique: true },
    email:          { type: String, required: true, unique: true },
    // TODO: remove password field after all storages will updated to hash
    password:       { type: String, required: false, unique: false },
    passwordHash:   { type: String, required: true, unique: false },
    name:           { type: String },
    emailConfirmed: { type: Boolean, default: false },
    enabled:        { type: Boolean, default: true },
});


module.exports = {
    userSchema
}
