import express from 'express';
import cors from 'cors';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import activityRoute from './routes/activityRoute';
import connectionRoute from './routes/connectionRoute';
import incentiveRoute from './routes/incetiveRoute';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/activities', activityRoute);
app.use('/incentives', incentiveRoute);
app.use('/connections', connectionRoute);

app.use(notFoundHandler);
app.use(errorHandler);
