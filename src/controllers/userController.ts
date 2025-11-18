import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(status.OK).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const user = await userService.updateUser(req.params.id, req.body);
    res.status(status.OK).json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await userService.deleteUser(req.params.id);
    res.status(status.ACCEPTED).json({ message: 'Usuário deletado' });
  } catch (err) {
    next(err);
  }
};
