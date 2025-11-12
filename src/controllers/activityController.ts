import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as activityService from '../services/activityService';

export const getAllActivities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activities = await activityService.getAllActivities();
    res.status(status.OK).json(activities);
  } catch (err) {
    next(err);
  }
};

export const getActivityById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activity = await activityService.getActivityById(req.params.id);
    res.status(status.OK).json(activity);
  } catch (err) {
    next(err);
  }
};

export const createActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activity = await activityService.createActivity(req.body);
    res.status(status.CREATED).json(activity);
  } catch (err) {
    next(err);
  }
};

export const updateActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const activity = await activityService.updateActivity(
      req.params.id,
      req.body,
    );
    res.status(status.OK).json(activity);
  } catch (err) {
    next(err);
  }
};

export const deleteActivity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await activityService.deleteActivity(req.params.id);
    res.status(status.ACCEPTED).json({ message: 'Atividade deletada' });
  } catch (err) {
    next(err);
  }
};
