import z from 'zod';
import moment from 'moment';

import { lib } from '../../../utils/lib';

export const PhoneNumberSchema = z.object({
   phoneNumber: z
      .string()
      .transform((value) => lib.parsePhoneNumber(value))
      .refine((value) => Boolean(value), { error: 'Please provide a valid Nigerian Number' }),
});

export const dateRangeSchema = z
   .object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
   })
   .refine((data) => moment(data.startDate).isSameOrBefore(data.endDate), {
      message: 'Start date must be before or same as end date',
      path: ['startDate'],
   });

export type IDateRange = z.infer<typeof dateRangeSchema>;
