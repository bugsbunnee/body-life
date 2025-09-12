import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { announcementRepository } from '../repositories/announcement.repository';

export const announcementController = {
   async createAnnouncement(req: Request, res: Response) {
      try {
         const announcement = await announcementRepository.createAnnouncement(req.body);
         res.json({ data: announcement });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Could not create the announcement',
         });
      }
   },

   async getActiveAnnouncements(req: Request, res: Response) {
      try {
         const announcements = await announcementRepository.getActiveAnnouncements();
         res.json({ data: announcements });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Could not fetch the announcements',
         });
      }
   },

   async deactivateAnnouncement(req: Request, res: Response) {
      try {
         const announcement = await announcementRepository.deactivateAnnouncement(+req.params.id!);
         res.json({ data: announcement });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Could not deactivate the announcement',
         });
      }
   },
};
