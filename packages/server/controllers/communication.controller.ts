import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { communicationService } from '../services/communication.service';

const communicationController = {
   async sendNewsletter(req: Request, res: Response) {
      try {
         const response = await communicationService.sendOutNewsletter(req.body);

         if (!response.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: response.message });
         }

         res.json(response);
      } catch (error) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send out newsletter.' });
      }
   },
};

export default communicationController;
