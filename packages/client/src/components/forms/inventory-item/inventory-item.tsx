import z from 'zod';

export const InventoryCreateSchema = z.object({
   name: z.string().min(1, 'Name is required').max(100, 'Name is too long (max 100 characters)'),
   description: z.string().min(1, 'Description is required').max(300, 'Description is too long (max 300 characters)'),
   department: z.string().min(1, 'Department is required'),
   quantity: z.number().min(1, 'Quantity must be at least 1'),
   unitPrice: z.number().min(1, 'Unit price must be at least 1'),
   datePurchased: z.date().max(new Date(), 'Date purchased cannot be in the future'),
});

export type IInventoryCreate = z.infer<typeof InventoryCreateSchema>;
