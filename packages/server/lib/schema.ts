import z from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
   conversationId: z.uuid(),
});

export const userSchema = z.object({
   firstName: z
      .string()
      .min(1, 'First Name is required')
      .max(30, 'First Name is too long (max 30 characters'),
   lastName: z
      .string()
      .min(1, 'Last Name is required')
      .max(30, 'Last Name is too long (max 30 characters'),
   address: z
      .string()
      .min(1, 'Address is required')
      .max(200, 'Address is too long (max 200 characters'),
   email: z.email(),
   birthDay: z.date(),
   phoneNumber: z
      .string()
      .refine(
         (value) => isValidPhoneNumber(value),
         'Please enter a valid phone number'
      ),
});

export type IUser = z.infer<typeof userSchema>;
