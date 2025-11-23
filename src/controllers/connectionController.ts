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

export const getFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const followers = await connectionService.getFollowers(req.params.userId);
    res.status(status.OK).json(followers);
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
    const user1 = req.user.id;
    const { user2 } = req.body;

    const connection = await connectionService.createConnection({
      user1,
      user2,
    });
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
    res.status(status.ACCEPTED).json({ message: 'Deixou de seguir' });
  } catch (err) {
    next(err);
  }
};
