import moment from 'moment';
import z from 'zod';

import { lib } from '../../../utils/lib';

export const MessageQuerySchema = z.object({
   title: z.string().optional(),
   date: z.coerce
      .date()
      .refine((value) => moment(value).isSameOrBefore(moment()))
      .optional(),
   videoUrl: z.string().optional(),
   preacher: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value))
      .optional(),
});

export const MessageCreationSchema = z.object({
   title: z.string().min(1, 'Title is required').max(55, 'Title is too long (max 100 characters'),
   preacher: z
      .string()
      .min(1, 'Preacher is required')
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value)),
   date: z.coerce.date().max(new Date()),
   videoUrl: z.url().min(1, 'Video URL is required'),
});

export const MessageUpdateSchema = z.object({
   content: z.string().min(1, 'Content is required'),
});

export type IMessageQuery = z.infer<typeof MessageQuerySchema>;
