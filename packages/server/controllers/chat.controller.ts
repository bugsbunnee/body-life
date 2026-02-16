import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { chatService } from '../services/chat.service';

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);

         res.json({ message: response.message });
      } catch (error) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to generate a response',
         });
      }
   },

   async transcribeAudio(req: Request, res: Response) {
      if (!req.file) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing audio file!' });
      }

      try {
         const message = await chatService.transcribeAudio(req.file);
         res.json({ message });
      } catch (error) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
      }
   },
};
