import moment from 'moment';
import type { IAnnouncement } from '../infrastructure/lib/schema';
import prisma from '../prisma/client';

export const announcementRepository = {
   async createAnnouncement(announcement: IAnnouncement) {
      return prisma.announcement.create({
         data: {
            title: announcement.title,
            content: announcement.content,
            imageUrl: announcement.imageUrl,
            scheduledFor: moment(announcement.scheduledFor).toDate(),
            isActive: true,
         },
      });
   },

   async getActiveAnnouncements() {
      return prisma.announcement.findMany({
         orderBy: { scheduledFor: 'asc' },
         where: { isActive: true },
      });
   },

   async deactivateAnnouncement(id: number) {
      return prisma.announcement.update({
         where: { id, isActive: true },
         data: { isActive: false },
      });
   },
};
