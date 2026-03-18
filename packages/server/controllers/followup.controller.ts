import _ from 'lodash';

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { communicationService } from '../services/communication.service';
import { adminRepository } from '../repositories/admin.repository';
import { followupRepository } from '../repositories/followup.repository';

import { FollowUpQuerySchema } from '../infrastructure/database/validators/followup.validator';
import { lib } from '../utils/lib';
import { dateRangeSchema } from '../infrastructure/database/validators/base.validator';

export const followupController = {
   async getFirstTimers(req: Request, res: Response) {
      try {
         const query = FollowUpQuerySchema.parse(req.query);
         const response = await followupRepository.getFirstTimers(req.pagination, query);

         res.json(response);
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get first timers' });
      }
   },

   async generateFirstTimersReport(req: Request, res: Response) {
      const query = dateRangeSchema.parse(req.query);

      const [firstTimers, recipients] = await Promise.all([followupRepository.generateFirstTimersReport(query), adminRepository.getFirstTimerReportAdmins()]);

      const isSent = await communicationService.sendOutFollowUpReportEmail({
         users: recipients,
         range: query,
         followUps: firstTimers,
         user: req.admin,
      });

      if (!isSent) {
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get first timers' });
      }

      res.json({ success: isSent, message: 'Report generated and sent successfully!' });
   },

   async updateFirstTimer(req: Request, res: Response) {
      try {
         const firstTimerId = lib.parseObjectId(req.params.id!);
         const response = await followupRepository.updateFirstTimer(firstTimerId, req.body);

         if (!response) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'The member with the given ID was not found!' });
         }

         res.json(response);
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update the first timer record.' });
      }
   },
};
