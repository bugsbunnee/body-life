import z from 'zod';

export const DepartmentCreateSchema = z.object({
   name: z.string().min(1, 'Name is required').max(100, 'Name is too long (max 100 characters)'),
   hod: z.object({ label: z.string(), value: z.string() }),
});

export type IDepartmentCreate = z.infer<typeof DepartmentCreateSchema>;
