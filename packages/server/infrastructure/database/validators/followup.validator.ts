import z from 'zod';
import moment from 'moment';

import { lib } from '../../../utils/lib';

export const FollowUpQuerySchema = z.object({
   user: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value))
      .optional(),
   status: z.string().optional(),
   serviceAttended: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value))
      .optional(),
   assignedTo: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value))
      .optional(),
   preferredContactMethod: z.string().optional(),
   wantsToJoinDepartment: z.boolean().optional(),
   dateJoinedStart: z.coerce.date().optional(),
   dateJoinedEnd: z.coerce.date().optional(),
});

export const FollowUpUpdateSchema = z.object({
   contactedAt: z.coerce.date().max(moment().toDate()),
   contactedBy: z.string().min(1, { error: 'Contacted By is required' }),
   channel: z.string().min(1, { error: 'Contact Method is required' }),
   status: z.string().min(1, { error: 'Status is required' }),
   response: z.string().min(1, { error: 'Response is required' }),
   successful: z.boolean(),
   wantsToJoinDepartment: z.boolean(),
});

export type IFollowUpQuery = z.infer<typeof FollowUpQuerySchema>;
export type IFollowUpUpdate = z.infer<typeof FollowUpUpdateSchema>;
