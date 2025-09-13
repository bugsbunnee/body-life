import _ from 'lodash';

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { SearchFilter } from '../infrastructure/lib/entities';
import type { Message } from '../generated/prisma';

import { communicationService } from '../services/communication.service';
import { messageRepository } from '../repositories/message.repository';

export const messageController = {
   async getMessages(req: Request, res: Response) {
      try {
         const filters = _.pick(req.query, ['search', 'field']);
         const response = await messageRepository.getMessages(req.pagination, filters as SearchFilter<Message>);

         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Could not fetch the messages',
         });
      }
   },

   async createMessage(req: Request, res: Response) {
      try {
         const response = await messageRepository.createMessage(req.body);
         res.status(StatusCodes.CREATED).json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to create the user',
         });
      }
   },

   async sendNewsletterEmail(req: Request, res: Response) {
      try {
         const messageSummary = await messageRepository.getMessageSummary(req.message.id);

         if (!messageSummary) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please generate the summary first!' });
            return;
         }

         const response = await communicationService.sendOutNewsletter(req.message, messageSummary);

         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Could not send the newsletter',
         });
      }
   },

   async summarizeMessage(req: Request, res: Response) {
      try {
         const response = await communicationService.getMessageTranscript(req.message);
         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Could not summarize the message',
         });
      }
   },

   async updateMessageSummary(req: Request, res: Response) {
      try {
         const messageSummary = await messageRepository.getMessageSummary(req.message.id);

         if (!messageSummary) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'Please generate the summary first!' });
            return;
         }

         const response = await messageRepository.storeMessageSummary(req.message.id, messageSummary.transcript, req.body.content);

         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Could not summarize the message',
         });
      }
   },
};
