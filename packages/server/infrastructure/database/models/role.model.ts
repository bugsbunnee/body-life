import mongoose from 'mongoose';
import type { ModelWithId } from './base.model';

const roleSchema = new mongoose.Schema({
   name: { type: String, required: true, trim: true },
   description: { type: String, trim: true },
   actions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }],
   isActive: { type: Boolean, default: true },
});

export type IRole = mongoose.InferSchemaType<typeof roleSchema>;
export type IRoleWithId = IRole & ModelWithId;

export const Role = mongoose.model<IRole>('Role', roleSchema);
