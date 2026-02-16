import _ from 'lodash';

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { communicationService } from '../services/communication.service';
import { MessageQuerySchema } from '../infrastructure/database/validators/message.validator';
import { messageRepository } from '../repositories/message.repository';
import { userRepository } from '../repositories/user.repository';
import logger from '../services/logger.service';

export const messageController = {
   async getMessages(req: Request, res: Response) {
      try {
         const query = MessageQuerySchema.parse(req.query);
         const response = await messageRepository.getMessages(req.pagination, query);

         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Could not fetch the messages' });
      }
   },

   async createMessage(req: Request, res: Response) {
      try {
         const user = await userRepository.getOneUserById(req.body.preacher);

         if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid User Provided!' });
         }

         const response = await messageRepository.createMessage(req.body);

         res.status(StatusCodes.CREATED).json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create the user' });
      }
   },

   async sendNewsletterEmail(req: Request, res: Response) {
      try {
         if (!req.message.summary) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please generate the summary first!' });
         }

         const response = await communicationService.sendOutNewsletter(req.message);

         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Could not send the newsletter' });
      }
   },

   async summarizeMessage(req: Request, res: Response) {
      try {
         const response = await communicationService.generateMessageSummary(req.message);
         res.json({ data: response });
      } catch (ex) {
         logger.error('Failed to summarize message', ex);

         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Could not summarize the message' });
      }
   },

   async updateMessageSummary(req: Request, res: Response) {
      try {
         if (!req.message.summary) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please generate the summary first!' });
         }

         const { content } = req.body;
         const { _id, summary } = req.message;

         const response = await messageRepository.storeMessageSummary(_id, summary.transcript, content);
         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Could not summarize the message' });
      }
   },
};
