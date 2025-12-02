import express from 'express';
import cors from 'cors';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import activityRoute from './routes/activityRoute';
import connectionRoute from './routes/connectionRoute';
import incentiveRoute from './routes/incetiveRoute';
import commentRoute from './routes/commentRoute';

export const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/health', (req, res) => {
  const host = process.env.HOSTNAME || 'Localhost';
  console.log(`[Backend ${host}] Recebeu Health Check! `);
  res.send(`Estou vivo! Respondendo do container: ${host}`);
});

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/activities', activityRoute);
app.use('/incentives', incentiveRoute);
app.use('/connections', connectionRoute);
app.use('/comments', commentRoute);

app.use(notFoundHandler);
app.use(errorHandler);
