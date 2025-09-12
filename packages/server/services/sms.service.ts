import axios from 'axios';

interface SMSSuccess {
   data: {
      status: string;
      message: string;
      message_id: string;
      cost: number;
      currency: string;
      gateway_used: string;
   };
}

interface SMSReport {
   recipient: boolean;
   delivery_status: string;
   cutomer_reference: string;
   callback_url: string;
   message_id: string;
   data: {
      recipient: string;
      delivery_status: string;
      message_id: string;
      cutomer_reference: string;
   };
}

interface SMSPayload {
   to: string;
   body: string;
}

export const smsService = {
   async sendSMS(params: SMSPayload) {
      return axios.post<SMSSuccess>(process.env.SMS_API_BASE_URL + '/sms', {
         from: 'RCNLagosIsland',
         to: params.to,
         body: params.body,
         api_token: process.env.SMS_API_TOKEN,
         gateway: 'direct-refund',
         append_sender: 'RCNLagosIsland',
         callback_url: '',
      });
   },

   async getSMSReport(report: SMSReport) {},
};
