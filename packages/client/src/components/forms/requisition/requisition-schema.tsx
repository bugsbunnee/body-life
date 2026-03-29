import { z } from 'zod';

export const requisitionCreateSchema = z.object({
   description: z.string().min(3, { error: 'Description must be at least 20 characters' }).max(200, { error: 'Description cannot be more than 200 characters.' }),
   amount: z.number().positive(),
   department: z.object({ label: z.string(), value: z.string() }),
});

export const requisitionUpdateSchema = z.object({
   status: z.string({ error: 'Requisition status is required' }),
});

export type IRequisitionCreate = z.infer<typeof requisitionCreateSchema>;
export type IRequisitionUpdate = z.infer<typeof requisitionUpdateSchema>;
