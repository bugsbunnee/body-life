import z from 'zod';
import { PhoneNumberSchema } from './base.validator';

export const SMSSchema = PhoneNumberSchema.extend({
   body: z.string().min(1, 'Text body is required').max(200, 'Text body is too long'),
});
