import { z } from 'zod';
import { IncentiveType } from '../entities/Incentive';

export const createIncentiveSchema = z.object({
  type: z
    .nativeEnum(IncentiveType)
    .refine((val) => Object.values(IncentiveType).includes(val), {
      message: `Tipo deve ser um dos seguintes: ${Object.values(IncentiveType).join(', ')}`,
    }),

  authorId: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      'authorId deve ser um UUID válido',
    ),

  activityId: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      'activityId deve ser um UUID válido',
    ),
});
