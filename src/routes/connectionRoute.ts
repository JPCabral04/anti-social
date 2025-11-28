import { Router } from 'express';
import {
  createConnection,
  deleteConnection,
  getConnectionsByUser,
  getFollowers,
} from '../controllers/connectionController';
import { authenticate } from '../middlewares/authMiddleware';

const connectionRoute = Router();

connectionRoute.use(authenticate);

connectionRoute.get('/following/:userId', getConnectionsByUser);
connectionRoute.get('/followers/:userId', getFollowers);
connectionRoute.post('/', createConnection);
connectionRoute.delete('/:id', deleteConnection);

export default connectionRoute;
