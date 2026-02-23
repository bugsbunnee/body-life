import z from 'zod';
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from '@/utils/constants';

export const ProgramCreateSchema = z.object({
   file: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, { message: 'File must be less than 5MB' })
      .refine((file) => ACCEPTED_TYPES.includes(file.type), { message: 'Only JPG, PNG, or PDF files are allowed' }),
   title: z.string().trim().min(1, 'Title is required').max(55, 'Title is too long (max 100 characters)'),
   description: z.string().trim().min(1, 'Description is required'),
   address: z.string().trim().min(1, 'Address is required'),
   scheduledFor: z.date(),
});

export type IProgramCreate = z.infer<typeof ProgramCreateSchema>;
