import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import type { Game } from './game-model';

export interface User extends Document{
    username: string,
    email: string,
    password: string,
    authToken: string,
    games: Game[],
    createDate: Date,
}

const UserSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    email: { 
        type: String,
        required: true, 
        index: { 
            unique: true,
        }
    },
    password: { 
        type: String,
        required: true
    },
    authToken: {
        type: String,
        required: true,
    },
    createDate: { 
        type: Date,
        default: Date.now() 
    }, 
    games: [{
        ref: 'Game',
        type: Schema.Types.ObjectId,
    }],

});

UserSchema.pre('save', async function (this: User, next: (err?: Error | undefined) => void) {
    if(!this.isModified('password')){
        return next();
    }
    bcrypt.hash(this.password, 10, (err: Error, hash: string) => {
        if (err){ 
            return next(err);
        }
        this.password = hash;
      });
});

UserSchema.methods.comparePasswords = async function (candidatePassword: string,
    next: (err: Error | null, same: boolean | null) => void) {
    
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err){
            return next(err, null);
        }
        next(null, isMatch);
    });
}



const userModel = mongoose.model('User', UserSchema);
export default userModel;