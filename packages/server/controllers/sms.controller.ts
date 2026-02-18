import axios from 'axios';

import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { whatsappService } from '../services/whatsapp.service';

export const smsController = {
   async sendMessage(req: Request, res: Response) {
      try {
         const response = await whatsappService.sendWhatsappMessage(req.body.phoneNumber, req.body.body);

         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: axios.isAxiosError(ex) ? ex.response?.data.error.message : (<Error>ex).message,
         });
      }
   },
};
