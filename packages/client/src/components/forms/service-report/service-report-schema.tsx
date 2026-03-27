import { z } from 'zod';

const countSchema = z.object({
   time: z.string(),
   round: z.number().positive(),
   adults: z.number().positive(),
   children: z.number().positive(),
});

export const serviceReportSchema = z.object({
   prepPrayers: z.object({
      label: z.string(),
      value: z.string(),
   }),
   worship: z.object({
      label: z.string(),
      value: z.string(),
   }),
   message: z.object({
      label: z.string(),
      value: z.string(),
   }),
   seatArrangementCount: z.number().positive(),
   firstTimerCount: z.number().min(0),
   offering: z.number().positive(),
   serviceDate: z.date().max(new Date()),
   counts: z.array(countSchema).min(1, { error: 'Please add count data' }),
});

export type IServiceReport = z.infer<typeof serviceReportSchema>;
