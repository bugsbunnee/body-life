import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { announcementRepository } from '../repositories/announcement.repository';
import { lib } from '../utils/lib';

export const announcementController = {
   async createAnnouncement(req: Request, res: Response) {
      try {
         const announcement = await announcementRepository.createAnnouncement(req.body);
         res.json({ data: announcement });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Could not create the announcement',
         });
      }
   },

   async getActiveAnnouncements(req: Request, res: Response) {
      try {
         const announcements = await announcementRepository.getActiveAnnouncements();
         res.json({ data: announcements });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Could not fetch the announcements',
         });
      }
   },

   async deactivateAnnouncement(req: Request, res: Response) {
      try {
         const anouncementId = lib.parseObjectId(req.params.id!);
         const announcement = await announcementRepository.deactivateAnnouncement(anouncementId);

         res.json({ data: announcement });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Could not deactivate the announcement',
         });
      }
   },
};
