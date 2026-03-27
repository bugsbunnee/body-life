import axios from 'axios';
import crypto from 'node:crypto';
import logger from '../services/logger.service';

import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { whatsappService } from '../services/whatsapp.service';
import { userRepository } from '../repositories/user.repository';

export const smsController = {
   async sendMessage(req: Request, res: Response) {
      try {
         const user = await userRepository.getOneUserById(req.body.userId);

         if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'The user with the given ID does not exist.' });
         }

         const response = await whatsappService.sendWelcomeMessage(user);

         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: axios.isAxiosError(ex) ? ex.response?.data.error.message : (<Error>ex).message,
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
