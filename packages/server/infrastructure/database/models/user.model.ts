import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
   {
      firstName: { type: String, minlength: 3, required: true },
      lastName: { type: String, minlength: 3, required: true },
      email: { type: String, unique: true, required: true },
      phoneNumber: { type: String, unique: true, required: true },
      address: { type: String, minlength: 3, required: true },
      gender: { type: String, required: true },
      maritalStatus: { type: String, required: true },
      dateOfBirth: { type: Date, required: false },
      department: { type: mongoose.Schema.ObjectId, ref: 'Department', required: false },
      prayerCell: { type: mongoose.Schema.ObjectId, ref: 'PrayerCell', required: false },
      notes: { type: String, required: false },
      isFirstTimer: { type: Boolean, default: false },
      isSubscribedToNewsletter: { type: Boolean, default: true },
      reasonForUnsubscription: { type: String, required: false },
   },
   {
      timestamps: true,
   }
);

export type IUser = mongoose.InferSchemaType<typeof userSchema> & {
   _id: mongoose.Types.ObjectId;
};

export const User = mongoose.model<IUser>('User', userSchema);
