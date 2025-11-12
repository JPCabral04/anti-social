import express from 'express';
import cors from 'cors';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();
app.use(cors());
app.use(express.json());

app.use(notFoundHandler);
app.use(errorHandler);
