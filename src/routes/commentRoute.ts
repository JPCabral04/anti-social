import { Router } from 'express';
import { createComment, getComments } from '../controllers/commentController';
import { authenticate } from '../middlewares/authMiddleware';
import { validateZod } from '../middlewares/zodValidation';
import { createCommentSchema } from '../schemas/commentSchema';

const commentRoute = Router();
commentRoute.use(authenticate);

commentRoute.post('/', validateZod(createCommentSchema), createComment);
commentRoute.get('/activity/:activityId', getComments);

export default commentRoute;
