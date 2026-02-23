import moment from 'moment';
import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

const programSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         required: true,
      },
      address: {
         type: String,
         required: true,
      },
      imageUrl: {
         type: String,
         required: true,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      scheduledFor: {
         type: Date,
         required: true,
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

programSchema.virtual('isUpcoming').get(function () {
   if (!this.scheduledFor) return false;

   return moment(this.scheduledFor).isAfter(moment());
});

programSchema.plugin(mongooseLeanVirtuals);

export type IProgram = mongoose.InferSchemaType<typeof programSchema> & {
   isUpcoming: boolean;
};

export const Program = mongoose.model<IProgram>('Program', programSchema);
