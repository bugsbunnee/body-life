import axios from 'axios';

const http = axios.create({
   baseURL: process.env.WHATSAPP_API_URL,
   headers: {
      Authorization: 'Bearer ' + process.env.WHATSAPP_API_TOKEN,
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
