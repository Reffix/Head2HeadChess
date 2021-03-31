import userModel from '../models/user-model';

export default class UserService {
    async login(username: string, password: string){
        const user = await userModel.findOne({ username: username });

        
    }
}