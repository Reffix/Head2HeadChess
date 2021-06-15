import type { Handler } from 'express';
import UserService from '../services/user-service';

const userService = new UserService();

const authenticate: Handler = async (request, response, next) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ error: 'Missing auth header' });
  }

  const [authType, token] = authHeader.split(' ', 2);

  if (authType !== 'Bearer') {
    return response.status(401).json({ error: 'Invalid authentication type' });
  }

  const user = await userService.userByToken(token);
  if (!user) {
    return response.status(401).json({ error: 'Invalid authentication token' });
  }

  response.locals.user = user;
  next();
};

export default authenticate;
