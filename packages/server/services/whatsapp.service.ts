import axios from 'axios';

const businessPhoneNumberId = '877227235479197';
const token =
   'EAAMnEHKFv1EBQHthZBNTdEynnUC4zkjWWXnqZAe1ZCNsK5ZBGabtxmZCwxsZBNX0ZAi4BYCFRZAag5PthrZCYV9vTsfMoaay7mZArMcDGAW3DsbnzbrqSgQZBTuUZCPZBtvLd9HUeMh9g8TalebLzjmez49fXobIAxa7G1zJc87ZCmZB7kdQ4xODLy7YyG2eTWOh2aJiXxunpcZAvYa3QgOHzDIMSlOnh7aY2DfhBQxfMGIK2gpzArL8ED53hPZBV3coXnIO9qWjSZBRz6jf40ooR2GVjYObFfpVc8';

const http = axios.create({
   baseURL: 'https://graph.facebook.com/v22.0/' + businessPhoneNumberId,
   headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
   },
});

export const whatsappService = {
   async sendWhatsappMessage(to: string, message: string) {
      return http.post('/messages', {
         messaging_product: 'whatsapp',
         to,
         type: 'text',
         text: { body: message },
      });
   },
};
