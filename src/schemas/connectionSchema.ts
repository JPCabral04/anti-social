import { z } from 'zod';

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const createConnectionSchema = z
  .object({
    user1: z.string().regex(uuidRegex, 'user1 deve ser um UUID válido'),

    user2: z.string().regex(uuidRegex, 'user2 deve ser um UUID válido'),
  })
  .refine((data) => data.user1 !== data.user2, {
    message: 'user1 e user2 não podem ser o mesmo usuário',
    path: ['user2'],
  });

export type CreateConnectionDto = z.infer<typeof createConnectionSchema>;
