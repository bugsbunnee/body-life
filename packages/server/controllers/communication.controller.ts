import type { Request, Response } from 'express';

import moment from 'moment';
import redisService from '../services/redis.service';

import { StatusCodes } from 'http-status-codes';
import { communicationService } from '../services/communication.service';
import { CACHE_NAMES } from '../utils/constants';

const communicationController = {
   async sendNewsletter(req: Request, res: Response) {
      try {
         const cacheKey = CACHE_NAMES.GET_NEWSLETTER_LIMIT(moment().format('YYYY-MM-DD'));
         const result = await redisService.retrieveItem(cacheKey);

         if (result) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You have already sent a general message today. Please wait till tomorrow.' });
         }

         const response = await communicationService.sendOutNewsletter(req.body);

         if (!response.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: response.message });
         }

         await redisService.storeItem(cacheKey, 'yes', 86_400);

         res.json(response);
      } catch (error) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send out newsletter.' });
      }
   },
};

export default communicationController;
