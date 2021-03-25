import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true} },
    email: { type: String, required: true, index: { unique: true} },
    password: { type: String, required: true },
    createDate: { type: Date, default: Date.now() }, 
});

UserSchema.methods.getName = function() : String{
    return this.username;
};

module.exports = model('User', UserSchema);