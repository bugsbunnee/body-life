import type React from 'react';
import axios from 'axios';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { Textarea } from '../../ui/textarea';
import { getErrorMessage } from '@/lib/utils';

const textSchema = z.object({
   body: z.string().min(1, 'Text body is required').max(200, 'Text body is too long'),
});

type ISMS = z.infer<typeof textSchema>;

type Props = { phoneNumber: string };

const SendMessageForm: React.FC<Props> = ({ phoneNumber }) => {
   const form = useForm<ISMS>({
      resolver: zodResolver(textSchema),
   });

   const mutation = useMutation({
      mutationFn: (body: ISMS) =>
         axios.post('/api/sms', {
            phoneNumber,
            body: body.body,
         }),
      onSuccess: (response) => {
         toast('Success!', {
            description: response.data.message,
         });

         form.reset();
      },
      onError: (error) =>
         toast('Could not send the text', {
            description: getErrorMessage(error),
            className: 'text-dark',
         }),
   });

   const handleCreateUser = (user: ISMS) => {
      mutation.mutate(user);
   };

   return (
      <div className="border border-[#EFEFEF] rounded-md flex flex-col">
         <div className="border-b border-b-[#EFEFEF] bg-blue-light text-base text-main font-semibold py-3 px-3.5 capitalize">Send SMS</div>

         <dl className="px-3.5 py-4">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
                  <FormField
                     control={form.control}
                     name="body"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Textarea placeholder="Enter text message" className="resize-none rounded-lg border border-border p-4 shadow-none w-full" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button
                     type="submit"
                     disabled={!form.formState.isValid || form.formState.isSubmitting}
                     className="text-sm text-white bg-main font-semibold rounded-sm w-full max-w-36 h-12"
                  >
                     {form.formState.isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </Button>
               </form>
            </Form>
         </dl>
      </div>
   );
};

export default SendMessageForm;
