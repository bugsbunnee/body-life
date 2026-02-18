import z from 'zod';
import { lib } from '../../../utils/lib';

export const InventoryQuerySchema = z.object({
   search: z.string().optional(),
   minPrice: z.coerce.number().min(0, 'Minimum price cannot be negative').optional(),
   maxPrice: z.coerce.number().min(0, 'Maximum price cannot be negative').optional(),
   department: z
      .string()
      .min(1, 'Department is required')
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value))
      .optional(),
   datePurchasedStart: z.coerce.date().optional(),
   datePurchasedEnd: z.coerce.date().optional(),
});

export const InventoryCreateSchema = z.object({
   name: z.string().min(1, 'Name is required').max(100, 'Name is too long (max 100 characters)'),
   description: z.string().min(1, 'Description is required').max(300, 'Description is too long (max 300 characters)'),
   department: z
      .string()
      .min(1, 'Department is required')
      .refine((value) => lib.getObjectIdIsValid(value))
      .transform((value) => lib.parseObjectId(value)),
   quantity: z.number().min(1, 'Quantity must be at least 1'),
   unitPrice: z.number().min(1, 'Unit price must be at least 1'),
   datePurchased: z.coerce.date().max(new Date(), 'Date purchased cannot be in the future'),
});

export type IInventoryQuery = z.infer<typeof InventoryQuerySchema>;
export type IInventoryCreate = z.infer<typeof InventoryCreateSchema>;
