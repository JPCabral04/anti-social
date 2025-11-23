import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { validateZod } from '../middlewares/zodValidation';
import { createUserSchema, loginSchema } from '../schemas/userSchema';

export const authRoute = Router();

authRoute.post('/register', validateZod(createUserSchema), register);
authRoute.post('/login', validateZod(loginSchema), login);

export default authRoute;
