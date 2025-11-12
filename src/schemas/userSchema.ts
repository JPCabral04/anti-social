import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),

  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido')
    .toLowerCase(),

  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),

  bio: z
    .string()
    .min(10, 'Bio deve ter no mínimo 10 caracteres')
    .max(500, 'Bio deve ter no máximo 500 caracteres')
    .optional()
    .default(''),

  developmentGoals: z
    .string()
    .min(10, 'Metas devem ter no mínimo 10 caracteres')
    .max(1000, 'Metas devem ter no máximo 1000 caracteres')
    .optional()
    .default(''),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional(),

  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido')
    .toLowerCase()
    .optional(),

  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .optional(),

  bio: z
    .string()
    .min(10, 'Bio deve ter no mínimo 10 caracteres')
    .max(500, 'Bio deve ter no máximo 500 caracteres')
    .optional(),

  developmentGoals: z
    .string()
    .min(10, 'Metas devem ter no mínimo 10 caracteres')
    .max(1000, 'Metas devem ter no máximo 1000 caracteres')
    .optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
