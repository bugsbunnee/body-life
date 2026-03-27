import axios from 'axios';
import moment from 'moment';
import crypto from 'node:crypto';

import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { userRepository } from '../repositories/user.repository';
import { smsService } from '../services/sms.service';
import { CACHE_NAMES } from '../utils/constants';

import logger from '../services/logger.service';
import redisService from '../services/redis.service';

export const smsController = {
   async sendMessage(req: Request, res: Response) {
      try {
         const cacheKey = CACHE_NAMES.GET_DAILY_MESSAGE_LIMIT(moment().format('YYYY-MM-DD'));
         const result = await redisService.retrieveItem(cacheKey);

         if (result) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You have already sent a general message today. Please wait till tomorrow.' });
         }

         const users = await userRepository.getUsersForNewsletter();

         if (users.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No users subscribed to newsletter. We can only send sms to users subscribed to our newsletter.' });
         }

         const response = await smsService.sendSMS({
            to: users.map((user) => user.phoneNumber).join(','),
            body: req.body.body,
         });

         await redisService.storeItem(cacheKey, 'yes', 86_400);

         res.json(response.data);
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: axios.isAxiosError(ex) ? ex.response?.data : (<Error>ex).message,
         });
      }
   },

   async receiveMessage(req: Request, res: Response) {
      const signature = req.headers['x-hub-signature-256'];

      if (!signature) {
         return res.status(StatusCodes.BAD_REQUEST).send('Missing signature');
      }

      const hash = crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET!).update(req.body).digest('hex');

      const expectedSignature = `sha256=${hash}`;

      if (signature !== expectedSignature) {
         return res.status(StatusCodes.FORBIDDEN).send('Invalid signature');
      }

      logger.info('Message received: ' + JSON.stringify(req.body));

      res.json({ message: 'Message received.' });
   },

   async verifyMessage(req: Request, res: Response) {
      if (req.query['hub.mode'] !== 'subscribe') {
         return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid mode provided.' });
      }

      if (process.env.VERIFY_TOKEN_SECRET !== req.query['hub.verify_token']) {
         return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token provided.' });
      }

      res.status(StatusCodes.OK).json({ message: 'Token Verified Successfully!' });
   },
};
