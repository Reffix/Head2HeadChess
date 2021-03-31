import { randomBytes } from 'node:crypto';
import userModel from '../models/user-model';

export default class UserService {
    async login(passedUsername: string, passedPassword: string){

        const user = await userModel.findOne({username: passedUsername});

        if(!passedUsername){
            throw new Error('Username can not be blank!');
        }

        if(!passedPassword) {
            throw new Error('Password can not be blank!')
        }

        if(!user && !user.comparePasswords(passedPassword)) {
            throw new Error('Invalid username or password!')
        }

        const authToken = randomBytes(64).toString('base64');
        
        await userModel.updateOne({username: user.username}, {$set: { authToken: authToken}});

        return {
            user,
            authToken,
        };
    }

    async register(passedUsername : string, passedEmail: string, passedPassword: string, confirmPassword: string){
        const existedUser = await userModel.findOne({username: passedUsername});

        if(existedUser){
            throw new Error('This username is already taken!');
        }

        if(!passedUsername){
            throw new Error('Username can not be blank!');
        }

        if(!passedEmail){
            throw new Error('Email can not be blank!');
        }

        if(!passedPassword){
            throw new Error('Password can not be blank!');
        }

        if(passedPassword === confirmPassword){
            throw new Error('Passwords do not match!');
        }

        return await new userModel({username: passedUsername, email: passedEmail, password: passedPassword}).save();
    }
}