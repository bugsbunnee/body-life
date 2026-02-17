import _ from 'lodash';

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { followupRepository } from '../repositories/followup.repository';
import { FollowUpQuerySchema } from '../infrastructure/database/validators/followup.validator';
import { lib } from '../utils/lib';

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
