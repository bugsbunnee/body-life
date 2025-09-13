import { Resend, type CreateEmailOptions, type CreateEmailResponse } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
   async sendSingleEmail(option: Omit<CreateEmailOptions, 'from'>) {
      return resend.emails.send({
         from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
         to: option.to,
         subject: option.subject,
         html: option.html,
         react: option.react,
      });
   },

   async sendBatchEmails(options: Omit<CreateEmailOptions, 'from'>[]) {
      return resend.batch.send(
         options.map((option) => ({
            from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
            to: option.to,
            subject: option.subject,
            html: option.html,
            react: option.react,
         }))
      );
   },

   async queueBatchEmails(options: Omit<CreateEmailOptions, 'from'>[]) {
      const success: CreateEmailResponse[] = [];
      const failed: Omit<CreateEmailOptions, 'from'>[] = [];

      for (const option of options) {
         try {
            const emailResponse = await this.sendSingleEmail(option);
            success.push(emailResponse);
         } catch (error) {
            console.error(error);

            failed.push(option);
         }
      }

      return { success, failed };
   },
};
