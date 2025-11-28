import { Router } from 'express';
import {
  createIncentive,
  getIncentivesByActivity,
} from '../controllers/incentiveController';
import { authenticate } from '../middlewares/authMiddleware';
import { validateZod } from '../middlewares/zodValidation';
import { createIncentiveSchema } from '../schemas/incentiveSchema';

const incentiveRoute = Router();

incentiveRoute.use(authenticate);

incentiveRoute.get('/activity/:activityId', getIncentivesByActivity);
incentiveRoute.post('/', validateZod(createIncentiveSchema), createIncentive);

export default incentiveRoute;
