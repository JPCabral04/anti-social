import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as connectionService from '../services/connectionService';

export const getConnectionsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Ação não permitida' });
    }

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
    if (req.user.id !== req.body.user1) {
      return res.status(403).json({ message: 'Ação não permitida' });
    }

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
    const connection = await connectionService.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Conexão não encontrada' });
    }

    if (
      connection.user1.id !== req.user.id &&
      connection.user2.id !== req.user.id
    ) {
      return res.status(403).json({ message: 'Ação não permitida' });
    }

    await connectionService.deleteConnection(req.params.id);

    res.status(status.ACCEPTED).json({ message: 'Conexão deletada' });
  } catch (err) {
    next(err);
  }
};
