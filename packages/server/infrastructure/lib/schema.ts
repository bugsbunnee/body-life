import z from 'zod';
import moment from 'moment';
import { isValidPhoneNumber } from 'libphonenumber-js';

export const announcementSchema = z.object({
   imageUrl: z.url(),
   title: z.string().trim().min(1, 'Title is required').max(55, 'Title is too long (max 100 characters)'),
   content: z.string().trim().min(1, 'Content is required').max(1000, 'Content is too long (max 1000 characters)'),
   scheduledFor: z.coerce.date().refine((value) => moment(value).isSameOrAfter(moment()), 'Announcement cannot be in the past'),
});

export const chatSchema = z.object({
   prompt: z.string().trim().min(1, 'Prompt is required').max(1000, 'Prompt is too long (max 1000 characters)'),
   conversationId: z.uuid(),
});

export const userSchema = z.object({
   firstName: z.string().min(1, 'First Name is required').max(30, 'First Name is too long (max 30 characters'),
   lastName: z.string().min(1, 'Last Name is required').max(30, 'Last Name is too long (max 30 characters'),
   address: z.string().min(1, 'Address is required').max(200, 'Address is too long (max 200 characters'),
   email: z.email(),
   birthDay: z.coerce.date(),
   phoneNumber: z.string().refine((value) => isValidPhoneNumber(value, 'NG'), 'Please enter a valid phone number'),
});

export const textSchema = z.object({
   phoneNumber: z.string().refine((value) => isValidPhoneNumber(value, 'NG'), 'Please enter a valid phone number'),
   body: z.string().min(1, 'Text body is required').max(200, 'Text body is too long'),
});

export type IAnnouncement = z.infer<typeof announcementSchema>;
export type IUser = z.infer<typeof userSchema>;
