import z from 'zod';

import { REQUISITION_STATUS } from '../entities/enums/requisition-status.enum';
import { lib } from '../../../utils/lib';

export const RequisitionQuerySchema = z.object({
   search: z.string().optional(),
   amountStart: z.number().positive().optional(),
   amountEnd: z.number().positive().optional(),
   status: z.enum(REQUISITION_STATUS).optional(),
   startDate: z.coerce.date().optional(),
   endDate: z.coerce.date().optional(),
   department: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value), { error: 'Invalid Department' })
      .transform((value) => lib.parseObjectId(value))
      .optional(),
});

export const RequisitionCreateSchema = z.object({
   description: z.string().min(3, { error: 'Description must be at least 20 characters' }).max(200, { error: 'Description cannot be more than 200 characters.' }),
   amount: z.number().positive(),
   department: z
      .string()
      .refine((value) => lib.getObjectIdIsValid(value), { error: 'Invalid Department' })
      .transform((value) => lib.parseObjectId(value)),
});

export const RequisitionActionSchema = z.object({
   status: z.enum(REQUISITION_STATUS),
});

export type IRequisitionQuery = z.infer<typeof RequisitionQuerySchema>;
export type IRequisitionCreate = z.infer<typeof RequisitionCreateSchema>;
