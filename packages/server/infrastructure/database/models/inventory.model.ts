import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      description: { type: String, required: true },
      unitPrice: { type: Number, min: 1, required: true },
      quantity: { type: Number, min: 1, required: true },
      datePurchased: { type: Date, required: true, default: Date.now },
      department: { type: mongoose.Schema.ObjectId, ref: 'Department', required: true },
   },
   { timestamps: true }
);

export type IInventory = mongoose.InferSchemaType<typeof inventorySchema>;
export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
