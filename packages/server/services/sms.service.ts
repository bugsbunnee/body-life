import axios from 'axios';

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
      return http.post<SMSSuccess>('/sms', {
         from: 'RCNIsland',
         to: params.to,
         body: params.body,
      });
   },
};
