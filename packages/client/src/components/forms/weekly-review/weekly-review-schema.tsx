import z from 'zod';

export const WeeklyReviewCreateSchema = z.object({
   serviceReport: z.string().min(1, 'Service Report is required'),
   department: z.string().min(1, 'Department is required'),
   fields: z.array(z.object({ label: z.string(), value: z.any() })).min(1, { error: 'At least one metric is required' }),
});

export type IWeeklyReviewCreate = z.infer<typeof WeeklyReviewCreateSchema>;
