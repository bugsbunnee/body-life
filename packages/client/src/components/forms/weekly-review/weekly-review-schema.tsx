import z from 'zod';

export const WeeklyReviewCreateSchema = z.object({
   serviceReport: z.object({ label: z.string(), value: z.string() }),
   department: z.object({ label: z.string(), value: z.string() }),
   fields: z.array(z.object({ label: z.string(), value: z.any() })).min(1, { error: 'At least one metric is required' }),
});

export type IWeeklyReviewCreate = z.infer<typeof WeeklyReviewCreateSchema>;
