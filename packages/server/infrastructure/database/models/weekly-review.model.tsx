import mongoose from 'mongoose';
import logger from '../../../services/logger.service';

import { communicationService } from '../../../services/communication.service';

interface IWeeklyReviewMethods {
   sendWeeklyReviewEmail: (departmentName: string, serviceDate: string) => Promise<void>;
}

const weeklyReviewSchema = new mongoose.Schema(
   {
      serviceReport: {
         type: mongoose.Schema.ObjectId,
         ref: 'ServiceReport',
         required: true,
      },

      department: {
         type: mongoose.Schema.ObjectId,
         ref: 'Department',
         required: true,
      },

      fields: [
         {
            label: { type: String, required: true },
            value: { type: mongoose.Schema.Types.Mixed, required: true },
         },
      ],

      feedback: { type: String },

      feedbackDueForActionAt: { type: Date },

      submittedBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', required: true },

      submittedAt: { type: Date, default: Date.now },
   },
   { timestamps: true }
);

weeklyReviewSchema.index({ service: 1, department: 1 }, { unique: true });

weeklyReviewSchema.methods.sendWeeklyReviewEmail = async function (departmentName: string, serviceDate: string) {
   try {
      await communicationService.sendOutWeeklyReview(this.toObject(), departmentName, serviceDate);
   } catch (error) {
      logger.error('Failed to send weekly review email...', error);
   }
};

export type IWeeklyReview = mongoose.InferSchemaType<typeof weeklyReviewSchema>;
export type IWeeklyReviewDocument = IWeeklyReview & Document & IWeeklyReviewMethods;

export const WeeklyReview = mongoose.model<IWeeklyReviewDocument>('WeeklyReview', weeklyReviewSchema);
