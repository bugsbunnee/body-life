import mongoose from 'mongoose';
import { FOLLOW_UP_STATUS, FollowUpStatus } from '../entities/enums/follow-up-status.enum';

const FollowUpAttemptSchema = new mongoose.Schema(
   {
      contactedAt: { type: Date, default: Date.now },
      contactedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
      channel: { type: String, required: true },
      response: { type: String },
      successful: { type: Boolean, default: false },
   },
   { _id: false }
);

const FollowUpSchema = new mongoose.Schema(
   {
      user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, unique: true },
      serviceAttended: { type: mongoose.Schema.ObjectId, ref: 'ServiceReport', required: true },
      status: { type: String, enum: FOLLOW_UP_STATUS, default: FollowUpStatus.Pending },
      assignedTo: { type: mongoose.Schema.ObjectId, ref: 'User' },
      attempts: { type: [FollowUpAttemptSchema], default: [] },
      feedback: { type: String },
      preferredContactMethod: { type: String },
      wantsToJoinDepartment: { type: Boolean, default: false },
      nextActionAt: { type: Date },
      closedAt: { type: Date },
   },
   { timestamps: true }
);

export type IFollowUp = mongoose.InferSchemaType<typeof FollowUpSchema>;
export const FollowUp = mongoose.model('FollowUp', FollowUpSchema);
