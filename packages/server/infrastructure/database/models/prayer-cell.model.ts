import mongoose from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

const prayerCellSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      address: { type: String, minlength: 3, required: true },
      meetingDay: { type: String, required: true },
      meetingTime: { type: String, required: true },
      leader: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
   },
   { timestamps: true }
);

prayerCellSchema.virtual('totalMembership', {
   ref: 'User',
   localField: '_id',
   foreignField: 'prayerCell',
   count: true,
});

prayerCellSchema.plugin(mongooseLeanVirtuals);

export type IPrayerCell = mongoose.InferSchemaType<typeof prayerCellSchema>;
export const PrayerCell = mongoose.model<IPrayerCell>('PrayerCell', prayerCellSchema);
