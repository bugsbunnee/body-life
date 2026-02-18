import z from 'zod';

export const PrayerCellCreateSchema = z.object({
   name: z.string().min(1, 'Name is required').max(100, 'Name is too long (max 100 characters)'),
   address: z.string().min(1, 'Address is required').max(300, 'Address is too long (max 300 characters)'),
   meetingDay: z.string().min(1, 'Meeting day is required').max(20, 'Meeting day is too long (max 20 characters)'),
   meetingTime: z.string().min(1, 'Meeting time is required').max(20, 'Meeting time is too long (max 20 characters)'),
   leader: z.string().min(1, 'Leader is required'),
});

export type IPrayerCellCreate = z.infer<typeof PrayerCellCreateSchema>;
