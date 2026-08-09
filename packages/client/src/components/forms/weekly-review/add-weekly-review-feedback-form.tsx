import React from 'react';

import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';

import Conditional from '@/components/common/conditional';
import http from '@/services/http.service';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

import { WeeklyReviewFeedbackSchema, type IWeeklyReviewFeedback } from './weekly-review-schema';
import { getErrorMessage } from '@/lib/utils';

interface Props {
   weeklyReviewId: string;
   onAddFeedback: () => void;
}

const AddWeeklyReviewFeedbackForm: React.FC<Props> = ({ weeklyReviewId, onAddFeedback }) => {
   const form = useForm<IWeeklyReviewFeedback>({
      resolver: zodResolver(WeeklyReviewFeedbackSchema),
   });

   const mutation = useMutation({
      mutationFn: (feedback: IWeeklyReviewFeedback) => http.post('/api/weekly-review/' + weeklyReviewId + '/feedback', feedback),
      onSuccess: () => {
         toast('Feedback added successfully!');

         form.reset();
         onAddFeedback();
      },
      onError: (error) =>
         toast('Could not add feedback', {
            description: getErrorMessage(error),
         }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((feedback) => mutation.mutate(feedback))} className="space-y-8">
            <FormField
               control={form.control}
               name="text"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-sm text-dark font-medium">Feedback</FormLabel>

                     <FormControl>
                        <Textarea
                           className="rounded-xl border border-border px-4 py-3 shadow-none w-full min-h-32"
                           placeholder="Note the feedback for this department..."
                           {...field}
                        />
                     </FormControl>

                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="dueForActionAt"
               render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel className="text-sm text-dark font-medium">Feedback Due Date</FormLabel>

                     <Popover>
                        <PopoverTrigger asChild>
                           <FormControl>
                              <Button variant="ghost" className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full justify-start">
                                 {field.value ? format(field.value, 'PPP') : <span>Pick a due date</span>}
                                 <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                           </FormControl>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              captionLayout="dropdown"
                           />
                        </PopoverContent>
                     </Popover>

                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
               className="text-sm text-white bg-green-600 font-semibold rounded-xl w-full h-12"
            >
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>
                  <span>Adding Feedback...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Add Feedback</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default AddWeeklyReviewFeedbackForm;
