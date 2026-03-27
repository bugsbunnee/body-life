import type React from 'react';

import Conditional from '@/components/common/conditional';
import http from '@/services/http.service';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { Textarea } from '../../ui/textarea';
import { getErrorMessage } from '@/lib/utils';
import { FaSpinner } from 'react-icons/fa';

const textSchema = z.object({
   body: z.string().min(1, 'Text body is required').max(200, 'Text body is too long'),
});

type ISMS = z.infer<typeof textSchema>;

type Props = { onSuccess: () => void };

const SendMessageForm: React.FC<Props> = ({ onSuccess }) => {
   const form = useForm<ISMS>({
      resolver: zodResolver(textSchema),
   });

   const mutation = useMutation({
      mutationFn: (body: ISMS) => http.post('/api/sms', { body: body.body }),
      onSuccess: (response) => {
         toast('Success!', { description: response.data.message });

         form.reset({ body: '' });
         onSuccess();
      },
      onError: (error) =>
         toast('Could not send the text', {
            description: getErrorMessage(error),
            className: 'text-dark',
         }),
   });

   return (
      <div className="border border-[#EFEFEF] rounded-md flex flex-col">
         <div className="border-b border-b-[#EFEFEF] bg-blue-light text-base text-main font-semibold py-3 px-3.5 capitalize">Send Message</div>
         <p className="text-sm text-gray-600 font-medium mt-3.5 px-3.5 max-w-lg">Send a general message like a service reminder, welfare check etc.</p>

         <dl className="px-3.5 py-4">
            <Form {...form}>
               <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                  <FormField
                     control={form.control}
                     name="body"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Textarea placeholder="Enter text message" className="resize-none rounded-xl border border-border p-4 shadow-none w-full" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button
                     type="submit"
                     disabled={!form.formState.isValid || form.formState.isSubmitting}
                     className="text-sm text-white bg-main font-semibold rounded-sm w-full h-12"
                  >
                     <Conditional visible={mutation.isPending}>
                        <div className="animate-spin">
                           <FaSpinner />
                        </div>

                        <span>Sending Message...</span>
                     </Conditional>

                     <Conditional visible={!mutation.isPending}>Send Message...</Conditional>
                  </Button>
               </form>
            </Form>
         </dl>
      </div>
   );
};

export default SendMessageForm;
