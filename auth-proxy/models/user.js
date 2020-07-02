const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    tenant:         { type: String, required: false, unique: false },
    user:           { type: String, required: true, unique: true }, // TODO: needed?
    name:           { type: String },
    email:          { type: String, required: true, unique: true },
    passwordHash:   { type: String, required: true, unique: false },
    emailConfirmed: { type: Boolean, default: false },
    enabled:        { type: Boolean, default: true },
});


module.exports = {
    userSchema
}
