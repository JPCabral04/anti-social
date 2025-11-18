import { Router } from 'express';
import {
  createActivity,
  deleteActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
} from '../controllers/activityController';
import { authenticate } from '../middlewares/authMiddleware';
import { validateZod } from '../middlewares/zodValidation';
import {
  createActivitySchema,
  updateActivitySchema,
} from '../schemas/activitySchema';

const activityRoute = Router();

activityRoute.use(authenticate);

activityRoute.get('/', getAllActivities);
activityRoute.get('/:id', getActivityById);
activityRoute.post('/', validateZod(createActivitySchema), createActivity);
activityRoute.put('/:id', validateZod(updateActivitySchema), updateActivity);
activityRoute.delete('/:id', deleteActivity);

export default activityRoute;
