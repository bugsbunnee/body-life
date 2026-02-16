import z from 'zod';

import { isValidPhoneNumber } from 'libphonenumber-js';

export const userSchema = z
   .object({
      firstName: z.string().min(1, 'First Name is required').max(30, 'First Name is too long (max 30 characters'),
      lastName: z.string().min(1, 'Last Name is required').max(30, 'Last Name is too long (max 30 characters'),
      address: z.string().min(1, 'Address is required').max(200, 'Address is too long (max 200 characters'),
      gender: z.string().min(1, 'Gender is required').max(200, 'Gender is too long (max 200 characters'),
      maritalStatus: z.string().min(1, 'Marital Status is required').max(20, 'Marital Status is too long (max 20 characters'),
      email: z.email().min(1, 'Email Address is required').max(200, 'Email Address is too long (max 50 characters'),
      dateOfBirth: z.date().max(new Date()),
      phoneNumber: z.string().refine((value) => isValidPhoneNumber(value, 'NG'), 'Please enter a valid phone number'),

      isFirstTimer: z.boolean().default(false),
      assignTo: z.string().optional(),
      notes: z.string().optional(),
      preferredContactMethod: z.string().optional(),
      serviceAttended: z.string().optional(),
   })
   .superRefine((data, ctx) => {
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

export type IUser = z.infer<typeof userSchema>;
