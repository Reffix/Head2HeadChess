import express from 'express';
import UserService from 'src/services/user-service';

const authRoute = express.Router();

const userService = new UserService();

authRoute.post('/login', async (request, response, next) => {
    try {
        const { passedUsername, passedPassword } = request.body;
        
        const authResult = await userService.login(passedUsername, passedPassword);

        response.json({
            id: authResult.user._id,
            username: authResult.user.username,
            email: authResult.user.email,
            authToken: authResult.authToken,
        });
    } catch (error) {
        return response.status(400).json({ error, message: error.message });
    }
});

