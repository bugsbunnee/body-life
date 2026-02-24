import z from 'zod';
import { lib } from '../../../utils/lib';

export const WeeklyReviewQuerySchema = z.object({
   service: z
      .string()
      .min(1, 'Service is required')
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value))
      .optional(),
   department: z
      .string()
      .min(1, 'Department is required')
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value))
      .optional(),
   startDate: z.coerce.date().optional(),
   endDate: z.coerce.date().optional(),
});

export const WeeklyReviewCreateSchema = z.object({
   serviceReport: z
      .string()
      .min(1, 'Service Report is required')
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value)),
   department: z
      .string()
      .min(1, 'Department is required')
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value)),
   fields: z.array(z.object({ label: z.string(), value: z.any() })).min(1, { error: 'At least one metric is required' }),
});

export type IWeeklyReviewQuery = z.infer<typeof WeeklyReviewQuerySchema>;
export type IWeeklyReviewCreate = z.infer<typeof WeeklyReviewCreateSchema>;
