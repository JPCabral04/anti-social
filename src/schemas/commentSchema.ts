import { z } from 'zod';

export const createCommentSchema = z.object({
  activityId: z.string().uuid(),
  content: z.string().min(1, 'O comentário não pode ser vazio'),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
