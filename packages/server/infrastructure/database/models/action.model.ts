import mongoose from 'mongoose';
import type { ModelWithId } from './base.model';

const actionSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
   },
   resource: {
      type: String,
      required: true,
      trim: true,
      index: true,
   },
   operation: {
      type: String,
      required: true,
      trim: true,
   },
   description: {
      type: String,
      trim: true,
   },
});

export type IAction = mongoose.InferSchemaType<typeof actionSchema>;
export type IActionWithId = IAction & ModelWithId;

export const Action = mongoose.model<IAction>('Action', actionSchema);
