import z from 'zod';

export const NewsletterSchema = z.object({
   messageHeader: z.string().min(1, { error: 'Message header is required!' }),
   messageBody: z.string().min(10, { error: 'Message body must be at least 10 characters' }),
});

export const NewsletterUnsubscribeSchema = z.object({
   reason: z.string().min(1, { error: 'Reason must be at least 1 character' }).optional(),
});

export type INewsletter = z.infer<typeof NewsletterSchema>;
export type INewsletterUnsubscribe = z.infer<typeof NewsletterUnsubscribeSchema>;
