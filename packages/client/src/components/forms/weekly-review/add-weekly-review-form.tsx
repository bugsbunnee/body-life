import React from 'react';
import Conditional from '@/components/common/conditional';

import { formatDate } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { getErrorMessage } from '@/lib/utils';
import { WeeklyReviewCreateSchema, type IWeeklyReviewCreate } from './weekly-review-schema';

import useDepartments from '@/hooks/useDepartments';
import useServiceReports from '@/hooks/useServiceReports';
import http from '@/services/http.service';

interface Props {
   onAddWeeklyReport: () => void;
}

const AddWeeklyReviewForm: React.FC<Props> = ({ onAddWeeklyReport }) => {
   const serviceReports = useServiceReports();
   const departments = useDepartments();

   const form = useForm<IWeeklyReviewCreate>({
      resolver: zodResolver(WeeklyReviewCreateSchema),
      defaultValues: {
         fields: [
            {
               label: 'How many team members were present in service',
               value: '',
            },
            {
               label: 'Did we encounter any technical issues during service? If yes, kindly specify',
               value: '',
            },
            {
               label: 'Which platforms were used for streaming?',
               value: '',
            },
            {
               label: 'How many viewers did we have on each platform?',
               value: '',
            },
            {
               label: 'Any challenges with the livestream on Sunday? If yes, kindly specify',
               value: '',
            },
            {
               label: 'Which platform did we have the most engagement this week?',
               value: '',
            },
            {
               label: 'Any challenges with the media equipment? If yes, kindly specify',
               value: '',
            },
            {
               label: 'Feedback/Comments/Recommendations',
               value: '',
            },
         ],
         serviceReport: '',
         department: '',
      },
   });

   const fields = useFieldArray({
      control: form.control,
      name: 'fields',
   });

   const mutation = useMutation({
      mutationFn: (data: IWeeklyReviewCreate) => http.post('/api/weekly-review', data),
      onSuccess: () => {
         toast('Saved the report successfully!');

         form.reset();
         onAddWeeklyReport();
      },
      onError: (error) =>
         toast('Could not upload the report', {
            description: getErrorMessage(error),
         }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((report) => mutation.mutate(report))} className="space-y-8">
            <div className="grid grid-cols-2 gap-5">
               <FormField
                  control={form.control}
                  name="serviceReport"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Service Date</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="Select Service Report" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {serviceReports.data.data.map((serviceReport) => (
                                 <SelectItem key={serviceReport._id} value={serviceReport._id}>
                                    {formatDate(serviceReport.serviceDate, 'PPP')}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Department</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="Select Department" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {departments.data.data.data.map((department) => (
                                 <SelectItem key={department._id} value={department._id}>
                                    {department.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>

                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="grid grid-cols-3 gap-5">
               {fields.fields.map((initialField, index) => (
                  <FormField
                     key={initialField.id}
                     control={form.control}
                     name={`fields.${index}.value`}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-sm text-dark font-medium">{initialField.label}</FormLabel>
                           <FormControl>
                              <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               ))}
            </div>

            <div className="border-b-1 my-4"></div>

            <div className="items-center flex gap-x-6">
               <Button
                  type="submit"
                  disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
                  className="text-sm text-white bg-green-600 font-semibold rounded-sm flex-1 h-12"
               >
                  <Conditional visible={mutation.isPending}>
                     <div className="animate-spin">
                        <FaSpinner />
                     </div>

                     <span>Creating Weekly Report...</span>
                  </Conditional>

                  <Conditional visible={!mutation.isPending}>Create Service Report</Conditional>
               </Button>
            </div>
         </form>
      </Form>
   );
};

export default AddWeeklyReviewForm;
