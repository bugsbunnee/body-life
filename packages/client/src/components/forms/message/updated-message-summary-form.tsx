import type React from 'react';

import Conditional from '@/components/common/conditional';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';

import { useMutation } from '@tanstack/react-query';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { getErrorMessage } from '@/lib/utils';

const summarySchema = z.object({
   content: z.string().min(1, 'Text body is required'),
});

type ISummary = z.infer<typeof summarySchema>;

type Props = { messageId: string; content: string };

const UpdateMessageSummaryForm: React.FC<Props> = ({ content, messageId }) => {
   const form = useForm<ISummary>({
      resolver: zodResolver(summarySchema),
      defaultValues: {
         content,
      },
   });

   const mutation = useMutation({
      mutationFn: (summary: ISummary) => axios.put(`/api/message/${messageId}/summary-cleanup`, { content: summary.content }),
      onError: (error) => toast('Could not update the message summary', { description: getErrorMessage(error), className: 'text-dark' }),
      onSuccess: (response) => {
         toast('Success!', { description: response.data.message });
         window.location.reload();
      },
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((user) => mutation.mutate(user))} className="space-y-4">
            <FormField
               control={form.control}
               name="content"
               render={({ field }) => (
                  <FormItem>
                     <FormControl>
                        <MDEditor {...field} value={field.value} onChange={field.onChange} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting} className="text-sm text-white bg-main font-semibold rounded-sm w-full max-w-36 h-12">
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Updating Summary...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Update Summary</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default UpdateMessageSummaryForm;
