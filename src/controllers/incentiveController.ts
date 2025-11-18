import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as incentiveService from '../services/incentiveService';

export const getIncentivesByActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const incentives = await incentiveService.getIncentivesByActivity(
      req.params.activityId,
    );
    res.status(status.OK).json(incentives);
  } catch (err) {
    next(err);
  }
};

export const createIncentive = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorId = req.user.id;
    const { type, activityId } = req.body;

    const incentive = await incentiveService.createIncentive({
      type,
      activityId,
      authorId,
    });

    res.status(status.CREATED).json(incentive);
  } catch (err) {
    next(err);
  }
};
