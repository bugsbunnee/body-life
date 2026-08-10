import z from 'zod';

export const WeeklyReviewCreateSchema = z.object({
   serviceReport: z.object({ label: z.string(), value: z.string() }),
   department: z.object({ label: z.string(), value: z.string() }),
   fields: z.array(z.object({ label: z.string(), value: z.any(), options: z.array(z.string()).optional() })).min(1, { error: 'At least one metric is required' }),
});

export const WeeklyReviewFeedbackSchema = z.object({
   text: z.string().min(1, { error: 'Feedback is required' }),
   dueForActionAt: z.date({ error: 'Feedback due date is required' }),
});

export type IWeeklyReviewCreate = z.infer<typeof WeeklyReviewCreateSchema>;
export type IWeeklyReviewFeedback = z.infer<typeof WeeklyReviewFeedbackSchema>;
