import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { smsService } from '../services/sms.service';
import axios from 'axios';

export const smsController = {
   async sendMessage(req: Request, res: Response) {
      try {
         const response = await smsService.sendSMS({
            to: req.body.phoneNumber,
            body: req.body.body,
         });

         res.json({ data: response });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: axios.isAxiosError(ex) ? ex.response?.data.error.message : (<Error>ex).message,
         });
      }
   },
};
