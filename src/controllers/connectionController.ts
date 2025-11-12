import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as connectionService from '../services/connectionService';

export const getConnectionsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const connections = await connectionService.getConnectionsByUser(
      req.params.userId,
    );
    res.status(status.OK).json(connections);
  } catch (err) {
    next(err);
  }
};

export const createConnection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const connection = await connectionService.createConnection(req.body);
    res.status(status.CREATED).json(connection);
  } catch (err) {
    next(err);
  }
};

export const deleteConnection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await connectionService.deleteConnection(req.params.id);
    res.status(status.ACCEPTED).json({ message: 'Conexão deletada' });
  } catch (err) {
    next(err);
  }
};
