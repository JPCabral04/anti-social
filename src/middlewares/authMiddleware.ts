import { NextFunction, Request, RequestHandler, Response } from 'express';
import status from 'http-status';
import jwt from 'jsonwebtoken';
import { JwtUserPayload } from '../@types/express';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(status.UNAUTHORIZED).json({ message: 'Token ausente' });
    return;
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(status.UNAUTHORIZED).json({ message: 'Token inválido' });
    return;
  }
};
