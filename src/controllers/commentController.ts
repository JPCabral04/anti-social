import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as commentService from '../services/commentService';

import redis from '../lib/redis';

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authorId = req.user.id;
    const { activityId, content } = req.body;

    const comment = await commentService.createComment({
      activityId,
      content,
      authorId,
    });

    try {
      await redis.del('feed_activities');
    } catch (e) {
      console.error('Erro ao limpar cache redis', e);
    }

    res.status(status.CREATED).json(comment);
  } catch (err) {
    next(err);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const comments = await commentService.getCommentsByActivity(
      req.params.activityId,
    );
    res.status(status.OK).json(comments);
  } catch (err) {
    next(err);
  }
};
