import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { communicationService } from '../services/communication.service';

export const communicationController = {
   async sendNewsletterEmail(req: Request, res: Response) {
      try {
         const response = await communicationService.sendOutNewsletter();
         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Could not send the newsletter',
         });
      }
   },
};
