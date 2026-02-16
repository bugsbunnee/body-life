import z from 'zod';

const ServiceReportCount = z.object({
   time: z.string(),
   round: z.number().positive(),
   adults: z.number().positive(),
   children: z.number().positive(),
});

export const ServiceReportSchema = z.object({
   prepPrayers: z.string().min(1, 'Prep Prayers By is required'),
   worship: z.string().min(1, 'Worship By is required'),
   message: z.string().min(1, 'Sermon is required'),
   seatArrangementCount: z.number().positive(),
   firstTimerCount: z.number().min(0),
   offering: z.number().positive(),
   serviceDate: z.coerce.date().max(new Date()),
   counts: z.array(ServiceReportCount).min(1, { error: 'Please add count data' }),
});
