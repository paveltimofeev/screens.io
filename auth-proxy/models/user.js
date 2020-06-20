const { Schema, model } = require('mongoose');


const userSchema = new Schema({
    tenant:         { type: String, required: false, unique: true },
    user:           { type: String, required: true, unique: true },
    email:          { type: String, required: true, unique: true },
    password:       { type: String, required: true, unique: false },
    name:           { type: String },
    emailConfirmed: { type: Boolean, default: false },
    enabled:        { type: Boolean, default: true },
});


module.exports = {
    userSchema
}
