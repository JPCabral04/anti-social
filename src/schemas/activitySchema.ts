import { z } from 'zod';

export const createActivitySchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim(),

  description: z
    .string()
    .min(1, 'A descrição é obrigatória')
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .trim(),

  // --- NOVO CAMPO ---
  mediaUrl: z.string().optional(),
});

export const updateActivitySchema = z.object({
  title: z
    .string()
    .min(1, 'Título deve ter no mínimo 1 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim()
    .optional(),

  description: z
    .string()
    .min(1, 'Descrição deve ter no mínimo 1 caracteres')
    .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
    .trim()
    .optional(),

  // --- NOVO CAMPO ---
  mediaUrl: z.string().optional(),
});

export type CreateActivityDto = z.infer<typeof createActivitySchema>;
export type UpdateActivityDto = z.infer<typeof updateActivitySchema>;
