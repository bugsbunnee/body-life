import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import type { ModelWithId } from './base.model';
import { REQUISITION_STATUS, RequisitionStatus } from '../entities/enums/requisition-status.enum';

const requisitionSchema = new mongoose.Schema(
   {
      description: { type: String, min: 3, required: true },
      amount: { type: Number, min: 0, required: true },
      status: { type: String, enum: REQUISITION_STATUS, default: RequisitionStatus.Pending },
      department: { type: mongoose.Schema.ObjectId, ref: 'Department', required: true },
      requester: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
      actioner: { type: mongoose.Schema.ObjectId, ref: 'User', required: false },
      approvedAt: { type: Date, required: false },
      rejectedAt: { type: Date, required: false },
      disbursedAt: { type: Date, required: false },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

requisitionSchema.plugin(mongooseLeanVirtuals);

export type IRequisition = mongoose.InferSchemaType<typeof requisitionSchema>;
export type IRequisitionWithId = IRequisition & ModelWithId;

export const Requisition = mongoose.model<IRequisition>('Requisition', requisitionSchema);
