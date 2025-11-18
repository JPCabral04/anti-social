import { z } from 'zod';

export const createActivitySchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim(),

  description: z
    .string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .trim(),
});

export const updateActivitySchema = z.object({
  title: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim()
    .optional(),

  description: z
    .string()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .trim()
    .optional(),
});

export type CreateActivityDto = z.infer<typeof createActivitySchema>;
export type UpdateActivityDto = z.infer<typeof updateActivitySchema>;
