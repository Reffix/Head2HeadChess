import express from 'express';
import userModel from '../models/user-model';

const authRoute = express.Router();

authRoute.post('/login', async (request, response, next) => {
    try {
        const { username, password } = request.body;

        


    }
})