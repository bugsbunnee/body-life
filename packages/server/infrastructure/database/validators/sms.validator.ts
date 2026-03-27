import z from 'zod';
import { lib } from '../../../utils/lib';

export const SMSSchema = z.object({
   userId: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value), { error: 'Invalid User ID' })
      .transform((value) => lib.parseObjectId(value)),
   body: z.string().min(1, 'Text body is required').max(200, 'Text body is too long'),
});
