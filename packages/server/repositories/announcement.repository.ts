import moment from 'moment';
import mongoose from 'mongoose';

import { Announcement, type IAnnouncement } from '../infrastructure/database/models/announcement.model';

export const announcementRepository = {
   async createAnnouncement(announcement: IAnnouncement) {
      return Announcement.create({
         title: announcement.title,
         content: announcement.content,
         imageUrl: announcement.imageUrl,
         scheduledFor: moment(announcement.scheduledFor).toDate(),
         isActive: true,
      });
   },

   async getActiveAnnouncements() {
      return Announcement.find({ isActive: true, scheduledFor: { $gte: new Date() } }).sort({ scheduledFor: -1 });
   },

   async deactivateAnnouncement(id: mongoose.Types.ObjectId) {
      return Announcement.findByIdAndUpdate(id, { isActive: false }).exec();
   },
};
