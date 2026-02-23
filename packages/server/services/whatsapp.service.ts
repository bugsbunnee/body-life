import axios from 'axios';
import logger from './logger.service';

import type { IUser } from '../infrastructure/database/models/user.model';
import { CHURCH_DISPLAY_NAME } from '../utils/constants';
import { lib } from '../utils/lib';

const http = axios.create({
   baseURL: process.env.WHATSAPP_API_URL,
   headers: {
      Authorization: 'Bearer ' + process.env.WHATSAPP_API_TOKEN,
      'Content-Type': 'application/json',
   },
});

export const whatsappService = {
   async sendWhatsappMessage(to: string, message: string) {
      try {
         const response = await http.post('/messages', {
            messaging_product: 'whatsapp',
            to,
            type: 'template',
            template: {
               name: 'hello_world',
               language: {
                  code: 'en_US',
               },
            },
         });

         return response.data;
      } catch (error) {
         logger.error('Failed to send message', lib.getErrorMessage(error));

         return null;
      }
   },

   async sendHappyBirthdayMessage(user: IUser) {
      try {
         const response = await http.post('/messages', {
            messaging_product: 'whatsapp',
            to: user.phoneNumber,
            type: 'template',
            template: {
               name: 'hello_world',
               language: {
                  code: 'en_US',
               },
               components: [
                  {
                     type: 'header',
                     parameters: [
                        {
                           type: 'text',
                           text: user.firstName,
                        },
                     ],
                  },
                  {
                     type: 'body',
                     parameters: [
                        {
                           type: 'text',
                           text: user.firstName,
                        },
                        {
                           type: 'text',
                           text: CHURCH_DISPLAY_NAME,
                        },
                     ],
                  },
               ],
            },
         });

         return response.data;
      } catch (error) {
         logger.error('Failed to send birthday message', lib.getErrorMessage(error));

         return null;
      }
   },
};
