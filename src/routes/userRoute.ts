import { Router } from 'express';
import {
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController';
import { authenticate } from '../middlewares/authMiddleware';
import { updateUserSchema } from '../schemas/userSchema';
import { validateZod } from '../middlewares/zodValidation';

const userRoute = Router();

userRoute.use(authenticate);

userRoute.get('/:id', getUserById);
userRoute.put('/:id', validateZod(updateUserSchema), updateUser);
userRoute.delete('/:id', deleteUser);

export default userRoute;
