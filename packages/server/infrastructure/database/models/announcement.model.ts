import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      content: {
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
   { timestamps: true }
);

export type IAnnouncement = mongoose.InferSchemaType<typeof announcementSchema>;
export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);
