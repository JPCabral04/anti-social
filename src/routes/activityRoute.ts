import { Router } from 'express';
import {
  createActivity,
  deleteActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
} from '../controllers/activityController';
import { authenticate } from '../middlewares/authMiddleware';

const activityRoute = Router();

activityRoute.use(authenticate);

activityRoute.get('/', getAllActivities);
activityRoute.get('/:id', getActivityById);
activityRoute.post('/', createActivity);
activityRoute.put('/:id', updateActivity);
activityRoute.delete('/:id', deleteActivity);

export default activityRoute;
