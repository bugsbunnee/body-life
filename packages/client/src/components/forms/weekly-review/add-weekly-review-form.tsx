import React, { useEffect, useMemo } from 'react';
import _ from 'lodash';

import Conditional from '@/components/common/conditional';
import SearchableSelect from '@/components/common/searchable-select';

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
import useQueryStore from '@/store/query';

import http from '@/services/http.service';
import useAuthStore from '@/store/auth';

interface Props {
   onAddWeeklyReport: () => void;
}

const fieldMappings = {
   '69f7488b3700cccf6a81a282': [
      {
         label: 'How many members of the welfare department are active?',
         value: '',
      },
      {
         label: 'Do we have any sick members?',
         value: '',
      },
      {
         label: 'If your answer to the above is yes, was visitation done?',
         value: '',
      },
      {
         label: 'Was there any general visitation conducted this week?',
         value: '',
      },
      {
         label: 'Do we have members in dire need of financial support?',
         value: '',
      },
      {
         label: 'If the answer to the question above is yes, kindly specify what type of financial need.',
         value: '',
      },
      {
         label: 'Feedback/Needs/Recommendations',
         value: '',
      },
   ],
   '69978b399482addc07406aad': [
      {
         label: 'Total members in the department',
         value: '',
      },
      {
         label: 'How many members were present during service?',
         value: '',
      },
      {
         label: 'Were minstrels punctual for service?',
         value: '',
      },
      {
         label: 'If no, why not?',
         value: '',
      },
      {
         label: 'Any Challenges during ministration? (Yes/No) If yes, kindly specify',
         value: '',
      },
      {
         label: 'Recommendations/Comments/Suggestions',
         value: '',
      },
   ],
   '69b970e2f5db59e41b928f15': [
      {
         label: 'List the tasks that have been done for this week',
         value: '',
      },
      {
         label: 'List the tasks/projects ahead/not yet completed',
         value: '',
      },
      {
         label: 'Any challenges/Issues in carrying out weekly tasks?(Yes/No) If yes kindly specify',
         value: '',
      },
      {
         label: 'Feedback/Comments/Recommendations',
         value: '',
      },
   ],
   '6995fd384860672cdf3db569': [
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
   '69f744d48833629182d8bd13': [
      {
         label: 'Type of outreach activity',
         value: '',
      },
      {
         label: 'Location where outreach was conducted',
         value: '',
      },
      {
         label: 'How many people were saved',
         value: '',
      },
      {
         label: 'Were there testimonies/Miracles? if Yes, please state.',
         value: '',
      },
      {
         label: 'How many people are interested in follow-up?',
         value: '',
      },
      {
         label: 'What materials and equipment were used?',
         value: '',
      },
      {
         label: 'Did we partner with external ministries, organizations or local authorities? If yes, please state',
         value: '',
      },
      {
         label: 'Any challenges encountered?',
         value: '',
      },
      {
         label: 'Comments/Recommendation/Supplies needed for future purposes',
         value: '',
      },
   ],
   '69f745628833629182d8bd3b': [
      {
         label: 'How many team members were present in service?',
         value: '',
      },
      {
         label: 'Did equipment arrive on time?  Yes/No. If your answer is no, briefly explain why',
         value: '',
      },
      {
         label: 'Were there any technical issues during service?  Yes/No. If your answer is Yes, kindly specify which item had issues and why.',
         value: '',
      },
      {
         label: 'Comments/Recommendation/Supplies needed for future purposes',
         value: '',
      },
   ],
   '699e097e578b05c2fa48b1db': [
      {
         label: 'How many team members were present in service?',
         value: '',
      },
      {
         label: 'Were all items packed up using the checklist?',
         value: '',
      },
      {
         label: 'If your answer to the question above is no, briefly explain why.',
         value: '',
      },
      {
         label: 'Any challenges or issues? If yes, please explain',
         value: '',
      },
      {
         label: 'Feedback/Comments/Recommendations',
         value: '',
      },
   ],
   '69c591ee697de6c3f74e1faf': [
      {
         label: 'How many team members were present in service?',
         value: '',
      },
      {
         label: 'Did ushers arrive early to service and were chairs set up on time?  Yes/No. If your answer is no, briefly explain why',
         value: '',
      },
      {
         label: 'Were there any issues during service?  Yes/No. If your answer is Yes, kindly specify what issue.',
         value: '',
      },
      {
         label: 'Any equipment or supply issue? (e.g. Missing baskets, offering envelopes etc.) Yes/No. If your answer is Yes, kindly specify which item and what the issue is',
         value: '',
      },
      {
         label: 'Feedback/Comments/Recommendations',
         value: '',
      },
   ],
   '69f7474e3700cccf6a81a1f0': [
      {
         label: 'How many teachers were present in service?',
         value: '',
      },
      {
         label: 'How many children were in church?',
         value: '',
      },
      {
         label: 'Number of boys?',
         value: '',
      },
      {
         label: 'Number of girls?',
         value: '',
      },
      {
         label: 'Give a brief summary of the lesson details and activities done',
         value: '',
      },
      {
         label: 'Any feedback received from parents? (Yes/No). If yes, please elaborate.',
         value: '',
      },
      {
         label: 'Any notes/homework given to the children?  (Yes/No)',
         value: '',
      },
      {
         label: 'Challenges/Feedback/Comments/Recommendations',
         value: '',
      },
   ],
};

const AddWeeklyReviewForm: React.FC<Props> = ({ onAddWeeklyReport }) => {
   const serviceReports = useServiceReports();
   const departments = useDepartments();
   const query = useQueryStore();

   const auth = useAuthStore();

   const form = useForm<IWeeklyReviewCreate>({
      resolver: zodResolver(WeeklyReviewCreateSchema),
   });

   const fields = useFieldArray({
      control: form.control,
      name: 'fields',
   });

   const mutation = useMutation({
      mutationFn: (data: IWeeklyReviewCreate) => http.post('/api/weekly-review', { ...data, serviceReport: data.serviceReport.value, department: data.department.value }),
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

   const { departmentId, departmentCount } = useMemo(() => {
      return {
         departmentId: auth.auth ? `${auth.auth.admin.department}` : undefined,
         departmentCount: departments.data.data.data.length,
      };
   }, [auth.auth, departments.data.data.data.length]);

   useEffect(() => {
      if (!auth.auth) {
         return;
      }

      const fieldValue = _.get(fieldMappings, `${auth.auth.admin.department}`) ?? [];
      const match = departments.data.data.data.find((department) => department._id === departmentId);

      form.reset({
         fields: fieldValue,
         department: match ? { label: match.name, value: match._id } : undefined,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [departmentId, departmentCount, form]);

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((report) => mutation.mutate(report))} className="space-y-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
               <FormField
                  control={form.control}
                  name="serviceReport"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Service Date</FormLabel>

                        <FormControl>
                           <SearchableSelect
                              isTriggered={serviceReports.isFetching}
                              onTriggerSearch={(name: string) => query.onSetDepartment({ name })}
                              data={serviceReports.data.data.map((report) => ({ label: `${formatDate(report.serviceDate, 'PPP')} (${report.message.title})`, value: report._id }))}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select Service"
                           />
                        </FormControl>

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

                        <Select disabled value={field.value?.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="No department assigned to your account" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              <Conditional visible={!!field.value}>
                                 <SelectItem value={field.value?.value ?? ''}>{field.value?.label}</SelectItem>
                              </Conditional>
                           </SelectContent>
                        </Select>

                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
               {fields.fields.map((initialField, index) => (
                  <FormField
                     key={initialField.id}
                     control={form.control}
                     name={`fields.${index}.value`}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-sm text-dark font-medium">{initialField.label}</FormLabel>
                           <FormControl>
                              <Input className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full" {...field} />
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
                  className="text-sm text-white bg-green-600 font-semibold rounded-xl flex-1 h-12"
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
