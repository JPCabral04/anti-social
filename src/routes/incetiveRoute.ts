import { Router } from 'express';
import {
  createIncentive,
  getIncentivesByActivity,
} from '../controllers/incentiveController';
import { authenticate } from '../middlewares/authMiddleware';

const incentiveRoute = Router();

incentiveRoute.use(authenticate);

incentiveRoute.get('/activity/:activityId', getIncentivesByActivity);
incentiveRoute.post('/', createIncentive);

export default incentiveRoute;
