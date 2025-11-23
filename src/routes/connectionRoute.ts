import { Router } from 'express';
import {
  createConnection,
  deleteConnection,
  getConnectionsByUser,
} from '../controllers/connectionController';
import { authenticate } from '../middlewares/authMiddleware';
import { createConnectionSchema } from '../schemas/connectionSchema';
import { validateZod } from '../middlewares/zodValidation';

const connectionRoute = Router();

connectionRoute.use(authenticate);

connectionRoute.get('/user/:userId', getConnectionsByUser);
connectionRoute.post(
  '/',
  validateZod(createConnectionSchema),
  createConnection,
);

connectionRoute.delete('/:id', deleteConnection);

export default connectionRoute;
