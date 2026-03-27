import z from 'zod';

export const SMSSchema = z.object({
   body: z.string().min(1, 'Text body is required').max(500, 'Text body is too long'),
});
