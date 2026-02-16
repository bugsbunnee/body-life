import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import type { ModelWithId } from './base.model';

const serviceCountSchema = new mongoose.Schema({
   time: { type: String, required: true },
   round: { type: Number, min: 1, required: true },
   adults: { type: Number, min: 0, required: true },
   children: { type: Number, min: 0, required: true },
});

const serviceReportSchema = new mongoose.Schema(
   {
      serviceDate: { type: Date, required: true },
      message: { type: mongoose.Schema.ObjectId, ref: 'Message', required: true },
      prepPrayers: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
      worship: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
      seatArrangementCount: { type: Number, min: 1, required: true },
      firstTimerCount: { type: Number, min: 0, required: true },
      offering: { type: Number, min: 0, required: true },
      counts: [serviceCountSchema],
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

serviceReportSchema.virtual('totalAttendance').get(function () {
   if (this.counts) {
      if (this.counts.length === 0) {
         return 0;
      }

      const counts = this.counts.map((count) => count.adults + count.children);
      return Math.max(...counts);
   }

   return 0;
});

serviceReportSchema.plugin(mongooseLeanVirtuals);

export type IServiceReport = mongoose.InferSchemaType<typeof serviceReportSchema>;
export type IServiceReportWithId = IServiceReport & ModelWithId;

export const ServiceReport = mongoose.model<IServiceReport>('ServiceReport', serviceReportSchema);
