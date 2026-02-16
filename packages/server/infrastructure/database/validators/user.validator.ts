import moment from 'moment';
import z from 'zod';

import { lib } from '../../../utils/lib';
import { PhoneNumberSchema } from './base.validator';

export const UserQuerySchema = z.object({
   firstName: z.string().optional(),
   lastName: z.string().optional(),
   address: z.string().optional(),
   email: z.string().optional(),
   maritalStatus: z.string().optional(),
   gender: z.string().optional(),
   dateOfBirthStart: z.coerce
      .date()
      .refine((value) => moment(value).isBefore(moment()), { error: 'Date of birth start must be in the past!' })
      .optional(),
   dateOfBirthEnd: z.coerce
      .date()
      .refine((value) => moment(value).isBefore(moment()), { error: 'Date of birth end must be in the past!' })
      .optional(),
   dateJoinedStart: z.coerce.date().optional(),
   dateJoinedEnd: z.coerce.date().optional(),
   phoneNumber: z.string().optional(),
   department: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value), { error: 'Invalid Department' })
      .transform((value) => lib.parseObjectId(value))
      .optional(),
   prayerCell: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value), { error: 'Invalid Prayer Cell' })
      .transform((value) => lib.parseObjectId(value))
      .optional(),
});

export const UserCreationSchema = PhoneNumberSchema.extend({
   firstName: z.string().min(1, 'First Name is required').max(30, 'First Name is too long (max 30 characters'),
   lastName: z.string().min(1, 'Last Name is required').max(30, 'Last Name is too long (max 30 characters'),
   address: z.string().min(1, 'Address is required').max(200, 'Address is too long (max 200 characters'),
   email: z.email(),
   maritalStatus: z.string().min(1, 'Marital Status is required').max(20, 'Marital Status is too long (max 20 characters'),
   gender: z.string().min(1, 'Gender is required').max(200, 'Gender is too long (max 200 characters'),
   dateOfBirth: z.coerce.date().refine((value) => moment(value).isBefore(moment()), { error: 'Date of birth must be in the past!' }),
   department: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value), { error: 'Invalid Department' })
      .transform((value) => lib.parseObjectId(value))
      .optional(),
   prayerCell: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value), { error: 'Invalid Prayer Cell' })
      .transform((value) => lib.parseObjectId(value))
      .optional(),

   notes: z.string().optional(),
   isFirstTimer: z.boolean().default(false),
   assignTo: z.string().optional(),
   preferredContactMethod: z.string().optional(),
   serviceAttended: z.string().optional(),
}).superRefine((data, ctx) => {
   if (data.isFirstTimer) {
      const requiredFields: Array<keyof typeof data> = ['assignTo', 'notes', 'preferredContactMethod', 'serviceAttended'];

      requiredFields.forEach((field) => {
         const value = data[field];

         if (!value) {
            ctx.addIssue({
               path: [field],
               message: `${field.replace(/([A-Z])/g, ' $1')} is required for first timers`,
               code: 'custom',
            });
         }
      });
   }
});

export type IUserCreate = z.infer<typeof UserCreationSchema>;
export type IUserQuery = z.infer<typeof UserQuerySchema>;
