import type React from 'react';

import Conditional from '@/components/common/conditional';
import http from '@/services/http.service';
import dayjs from 'dayjs';

import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useMutation } from '@tanstack/react-query';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { getErrorMessage } from '@/lib/utils';
import { NewsletterUnsubscribeSchema, type INewsletterUnsubscribe } from './newsletter-schema';

interface Props {
   userId: string;
   onUnsubscribe: () => void;
}

const UnsubscribeNewsletterForm: React.FC<Props> = ({ userId, onUnsubscribe }) => {
   const form = useForm<INewsletterUnsubscribe>({
      resolver: zodResolver(NewsletterUnsubscribeSchema),
   });

   const mutation = useMutation({
      mutationFn: (newsletter: INewsletterUnsubscribe) => http.post(`/api/user/${userId}/unsubscribe`, newsletter),
      onSuccess: (response) => {
         toast('Success!', { description: response.data.message });
         onUnsubscribe();
      },
      onError: (error) => {
         toast('Could not unsubscribe from the newsletter', { description: getErrorMessage(error), className: 'text-dark' });
      },
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((user) => mutation.mutate(user))} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
               <h1 className="text-4xl md:text-5xl font-medium text-slate-900 mb-6 leading-[1.1]">
                  We're sorry to see <span className="text-orange-600 italic">you go.</span>
               </h1>

               <p className="text-lg text-slate-600 mb-8 leading-relaxed font-light">
                  You've been successfully removed from our newsletter list. We hope you found some inspiration during your time with us.
               </p>
            </motion.div>

            <div className="bg-blue-light p-6 rounded-2xl transition-all focus-within:bg-orange-50 focus-within:ring-1 focus-within:ring-orange-100 focus-within:border-orange-200">
               <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">
                           <MessageSquare className="w-4 h-4 text-slate-400" /> Help us improve our content
                        </FormLabel>
                        <FormControl>
                           <Textarea rows={6} placeholder="What did they say?" className="resize-none rounded-lg border border-border p-4 shadow-none w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting || mutation.isPending} className="mt-6 text-sm text-white bg-main font-semibold rounded-sm w-full h-12">
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Unsubscribing...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Unsubscribe From Newsletter</Conditional>
            </Button>

            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
               <p>© {dayjs().year()} . RCNLagos Island Church</p>
            </div>
         </form>
      </Form>
   );
};

export default UnsubscribeNewsletterForm;
