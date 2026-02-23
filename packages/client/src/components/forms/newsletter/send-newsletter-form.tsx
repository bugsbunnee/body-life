import type React from 'react';

import Conditional from '@/components/common/conditional';
import MDEditor from '@uiw/react-md-editor';
import http from '@/services/http.service';

import { useMutation } from '@tanstack/react-query';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/utils';
import { NewsletterSchema, type INewsletter } from './newsletter-schema';

interface Props {
   onSendNewsletter: () => void;
}

const SendNewsletterForm: React.FC<Props> = ({ onSendNewsletter }) => {
   const form = useForm<INewsletter>({
      resolver: zodResolver(NewsletterSchema),
   });

   const mutation = useMutation({
      mutationFn: (newsletter: INewsletter) => http.post(`/api/communication/newsletter`, newsletter),
      onError: (error) => toast('Could not send the newsletter', { description: getErrorMessage(error), className: 'text-dark' }),
      onSuccess: (response) => {
         toast('Success!', { description: response.data.message });
         onSendNewsletter();
      },
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((user) => mutation.mutate(user))} className="space-y-4">
            <FormField
               control={form.control}
               name="messageHeader"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-sm text-dark font-medium">Newsletter Title</FormLabel>
                     <FormControl>
                        <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="Enter newsletter title" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="messageBody"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-sm text-dark font-medium">Newsletter Body</FormLabel>
                     <FormControl>
                        <MDEditor {...field} value={field.value} onChange={field.onChange} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting} className="text-sm text-white bg-main font-semibold rounded-sm w-full h-12">
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Sending Newsletter...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Send Newsletter</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default SendNewsletterForm;
