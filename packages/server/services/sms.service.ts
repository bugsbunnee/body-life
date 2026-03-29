import axios, { AxiosError } from 'axios';
import logger from './logger.service';

import type { IUser } from '../infrastructure/database/models/user.model';
import type { FollowUpParams } from '../utils/models';

import { CHURCH_DISPLAY_NAME } from '../utils/constants';

interface SMSSuccess {
   status: string;
   message: string;
   data: {
      id: string;
      recipients: 1;
      message_id: string;
      cost: number;
      currency: string;
      gateway_used: string;
   };
}

interface SMSPayload {
   to: string;
   body: string;
}

const http = axios.create({
   baseURL: process.env.SMS_API_BASE_URL,
   headers: {
      Authorization: 'Bearer ' + process.env.SMS_API_TOKEN,
      'Content-Type': 'application/json',
   },
});

export const smsService = {
   async sendSMS(params: SMSPayload) {
      try {
         const response = await http.post<SMSSuccess>('/sms', {
            from: 'RCNIsland',
            to: params.to,
            body: params.body,
         });

         logger.info('SMS successful: response=' + JSON.stringify(response.data));

         return { success: true, data: response.data, message: response.data.message };
      } catch (error) {
         const message = (<AxiosError>error).response?.data ?? (<Error>error).message;

         logger.info('SMS failed: error=' + JSON.stringify(message));

         return { success: false, data: null, message };
      }
   },

   async sendWelcomeSMS(user: IUser) {
      const body = `
         Hello, ${user.firstName}!

         Welcome to ${CHURCH_DISPLAY_NAME}! We are so glad you joined us today. We believe your visit 
         is not by chance. God has something special in store for you.

         Have a blessed week ahead!
      `;

      return this.sendSMS({
         to: user.phoneNumber,
         body,
      });
   },

   async sendFollowUpSMS(params: FollowUpParams) {
      const body = `
         Hello ${params.userFirstName},

         Please follow up with this church member at your earliest convenience:

         Name: ${params.firstTimerFirstName} ${params.firstTimerLastName},
         Contact: ${params.firstTimerPhoneNumber}
         Method: ${params.firstTimerPreferredContactMethod}
      `;

      return this.sendSMS({
         to: params.userPhoneNumber,
         body,
      });
   },

   async sendBulkHappyBirthdaySMS(users: IUser[]) {
      const body = `
         Happy Birthday!

         The entire ${CHURCH_DISPLAY_NAME} family celebrates YOU today! May God bless you abundantly, 
         fill your year with joy, good health, and divine favor.

         From ${CHURCH_DISPLAY_NAME}
      `;

      return this.sendSMS({
         to: users.map((user) => user.phoneNumber).join(','),
         body,
      });
   },
};
