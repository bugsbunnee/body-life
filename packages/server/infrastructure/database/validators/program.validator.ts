import moment from 'moment';
import z from 'zod';

export const ProgramQuerySchema = z.object({
   search: z.string().optional(),
   startDate: z.coerce.date().optional(),
   endDate: z.coerce.date().optional(),
});

export const ProgramCreateSchema = z.object({
   title: z.string().trim().min(1, 'Title is required').max(55, 'Title is too long (max 100 characters)'),
   description: z.string().trim().min(1, 'Description is required'),
   address: z.string().trim().min(1, 'Address is required'),
   scheduledFor: z.coerce.date().refine((value) => moment(value).isSameOrAfter(moment()), 'Program cannot be in the past'),
});

export type IProgramQuery = z.infer<typeof ProgramQuerySchema>;
export type IProgramCreate = z.infer<typeof ProgramCreateSchema>;
