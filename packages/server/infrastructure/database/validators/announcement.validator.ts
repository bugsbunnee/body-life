import moment from 'moment';
import z from 'zod';

export const AnnouncementSchema = z.object({
   imageUrl: z.url(),
   title: z.string().trim().min(1, 'Title is required').max(55, 'Title is too long (max 100 characters)'),
   content: z.string().trim().min(1, 'Content is required').max(1000, 'Content is too long (max 1000 characters)'),
   scheduledFor: z.coerce.date().refine((value) => moment(value).isSameOrAfter(moment()), 'Announcement cannot be in the past'),
});
