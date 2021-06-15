import express from 'express';
import UserService from '../services/user-service';

const userRoute = express.Router();

const userService = new UserService();

userRoute.post('/register', async (request, response, next) => {
    try {
        const { username, email, password, confirmPassword } = request.body;

        const user = await userService.register(username, email, password, confirmPassword);

        response.json({ username: user.username, success: 'User successfully registered!' });
    }catch (error){
        return response.status(409).json({ error, message: error.message });
    }
});

export default userRoute;