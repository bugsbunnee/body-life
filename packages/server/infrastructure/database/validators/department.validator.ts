import z from 'zod';
import { lib } from '../../../utils/lib';

export const DepartmentQuerySchema = z.object({
   name: z.string().optional(),
});

export const DepartmentCreateSchema = z.object({
   name: z.string().min(1, 'Name is required').max(100, 'Name is too long (max 100 characters)'),
   hod: z
      .string()
      .min(1, 'HOD is required')
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value)),
});

export type IDepartmentQuery = z.infer<typeof DepartmentQuerySchema>;
export type IDepartmentCreate = z.infer<typeof DepartmentCreateSchema>;
