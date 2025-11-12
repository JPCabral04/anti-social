import { Router } from 'express';
import {
  createConnection,
  deleteConnection,
  getConnectionsByUser,
} from '../controllers/connectionController';
import { authenticate } from '../middlewares/authMiddleware';

const connectionRoute = Router();

connectionRoute.use(authenticate);

connectionRoute.get('/user/:userId', getConnectionsByUser);
connectionRoute.post('/', createConnection);
connectionRoute.delete('/:id', deleteConnection);

export default connectionRoute;
