import type React from 'react';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { getErrorMessage } from '@/lib/utils';

const summarySchema = z.object({
   content: z.string().min(1, 'Text body is required'),
});

type ISummary = z.infer<typeof summarySchema>;

type Props = { messageId: number; content: string };

const UpdateMessageSummaryForm: React.FC<Props> = ({ content, messageId }) => {
   const form = useForm<ISummary>({
      resolver: zodResolver(summarySchema),
      defaultValues: {
         content,
      },
   });

   const mutation = useMutation({
      mutationFn: (summary: ISummary) =>
         axios.put(`/api/message/${messageId}/summary-cleanup`, {
            content: summary.content,
         }),
      onSuccess: (response) => {
         toast('Success!', {
            description: response.data.message,
         });

         window.location.reload();
      },
      onError: (error) =>
         toast('Could not update the message summary', {
            description: getErrorMessage(error),
            className: 'text-dark',
         }),
   });

   const handleUpdateSummary = (user: ISummary) => {
      mutation.mutate(user);
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(handleUpdateSummary)} className="space-y-4">
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

            <Button
               type="submit"
               disabled={form.formState.isSubmitting}
               className="text-sm text-white bg-main font-semibold rounded-sm w-full max-w-36 h-12"
            >
               {form.formState.isSubmitting ? 'Updating Summary...' : 'Update Summary'}
            </Button>
         </form>
      </Form>
   );
};

export default UpdateMessageSummaryForm;
