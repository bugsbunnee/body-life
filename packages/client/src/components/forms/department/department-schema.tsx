import z from 'zod';

export const DepartmentCreateSchema = z.object({
   name: z.string().min(1, 'Name is required').max(100, 'Name is too long (max 100 characters)'),
   hod: z.string().min(1, 'Head of Department is required'),
});

export type IDepartmentCreate = z.infer<typeof DepartmentCreateSchema>;
