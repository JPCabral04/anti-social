import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateZod = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: result.error.issues.map((err) => ({
          campo: err.path.join('.'),
          mensagem: err.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
};
