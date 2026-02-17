import dayjs from 'dayjs';
import z from 'zod';

export const FirstTimerUpdateSchema = z.object({
   contactedAt: z.date().max(dayjs().toDate()),
   contactedBy: z.string().min(1, { error: 'Contacted By is required' }),
   channel: z.string().min(1, { error: 'Contact Method is required' }),
   status: z.string().min(1, { error: 'Status is required' }),
   response: z.string().min(1, { error: 'Response is required' }),
   successful: z.boolean(),
   wantsToJoinDepartment: z.boolean(),
});

export type IFirstTimerUpdate = z.infer<typeof FirstTimerUpdateSchema>;
