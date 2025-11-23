import { z } from 'zod';
import { IncentiveType } from '../entities/Incentive';

export const createIncentiveSchema = z.object({
  type: z.nativeEnum(IncentiveType),
  activityId: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      'activityId deve ser um UUID válido',
    ),
});
export type CreateIncentiveDto = z.infer<typeof createIncentiveSchema>;
