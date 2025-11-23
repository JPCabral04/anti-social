import { Request, Response } from 'express';
import status from 'http-status';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(status.NOT_FOUND).json({
    error: 'Essa rota não existe',
  });
};
