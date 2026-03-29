import axios from 'axios';
import logger from './logger.service';

import type { IUser } from '../infrastructure/database/models/user.model';
import type { FollowUpParams } from '../utils/models';

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
   async sendFollowUpMessage(followUpParams: FollowUpParams) {
      try {
         const response = await http.post('/messages', {
            messaging_product: 'whatsapp',
            to: followUpParams.userPhoneNumber,
            type: 'template',
            template: {
               name: 'follow_up_notification',
               language: {
                  code: 'en',
               },
            },
            components: [
               {
                  type: 'body',
                  parameters: [
                     { type: 'text', parameter_name: 'workerName', text: followUpParams.userFirstName },
                     { type: 'text', parameter_name: 'churchName', text: CHURCH_DISPLAY_NAME },
                     { type: 'text', parameter_name: 'memberFirstName', text: followUpParams.firstTimerFirstName },
                     { type: 'text', parameter_name: 'memberLastName', text: followUpParams.firstTimerLastName },
                     { type: 'text', parameter_name: 'memberPhone', text: followUpParams.firstTimerPhoneNumber },
                     { type: 'text', parameter_name: 'memberPreferredContactMethod', text: followUpParams.firstTimerPreferredContactMethod },
                     { type: 'text', parameter_name: 'assignedDate', text: followUpParams.firstTimerAssignedAt.toDateString() },
                  ],
               },
            ],
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
               name: 'happy_birthday',
               language: {
                  code: 'en',
               },
               components: [
                  {
                     type: 'header',
                     parameters: [
                        {
                           type: 'text',
                           parameter_name: 'first_name',
                           text: user.firstName,
                        },
                     ],
                  },
                  {
                     type: 'body',
                     parameters: [
                        {
                           type: 'text',
                           parameter_name: 'first_name',
                           text: user.firstName,
                        },
                        {
                           type: 'text',
                           parameter_name: 'church_name',
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

   async sendWelcomeMessage(user: IUser) {
      try {
         const response = await http.post('/messages', {
            messaging_product: 'whatsapp',
            to: user.phoneNumber,
            type: 'template',
            template: {
               name: 'welcome_to_church',
               language: {
                  code: 'en',
               },
               components: [
                  {
                     type: 'body',
                     parameters: [
                        {
                           type: 'text',
                           parameter_name: 'first_name',
                           text: user.firstName,
                        },
                        {
                           type: 'text',
                           parameter_name: 'church_name',
                           text: CHURCH_DISPLAY_NAME,
                        },
                     ],
                  },
               ],
            },
         });

         logger.info('Message successfully sent: ' + JSON.stringify(response.data));

         return response.data;
      } catch (error) {
         logger.error('Failed to send welcome message', lib.getErrorMessage(error));

         return null;
      }
   },
};
