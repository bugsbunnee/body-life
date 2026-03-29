import React from 'react';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { requisitionCreateSchema, type IRequisitionCreate } from './requisition-schema';
import { getErrorMessage } from '@/lib/utils';

import Conditional from '@/components/common/conditional';
import SearchableSelect from '@/components/common/searchable-select';

import useQueryStore from '@/store/query';
import useDepartments from '@/hooks/useDepartments';
import http from '@/services/http.service';

interface Props {
   onAddRequisition: () => void;
}

const AddRequisitionForm: React.FC<Props> = ({ onAddRequisition }) => {
   const { onSetDepartment } = useQueryStore();

   const departments = useDepartments();

   const form = useForm<IRequisitionCreate>({
      resolver: zodResolver(requisitionCreateSchema),
   });

   const mutation = useMutation({
      mutationFn: (data: IRequisitionCreate) => http.post('/api/requisition', { ...data, department: data.department.value }),
      onSuccess: () => {
         toast('Your requisition has been sent for approval successfully!');

         form.reset();
         onAddRequisition();
      },
      onError: (error) =>
         toast('Could not create the requisition', {
            description: getErrorMessage(error),
         }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((report) => mutation.mutate(report))} className="space-y-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
               <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Department</FormLabel>

                        <FormControl>
                           <SearchableSelect
                              isTriggered={departments.isFetching}
                              onTriggerSearch={(name: string) => onSetDepartment({ name })}
                              data={departments.data.data.data.map((department) => ({ label: department.name, value: department._id }))}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select Department"
                           />
                        </FormControl>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Amount</FormLabel>

                        <FormControl>
                           <Input
                              type="number"
                              className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full"
                              placeholder="Enter the amount in Naira"
                              disabled={field.disabled}
                              name={field.name}
                              value={field.value}
                              onBlur={field.onBlur}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="mt-5">
               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Description</FormLabel>
                        <FormControl>
                           <Textarea
                              className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full"
                              placeholder="What is this requisition for?"
                              disabled={field.disabled}
                              name={field.name}
                              value={field.value}
                              onBlur={field.onBlur}
                              onChange={(e) => field.onChange(e.target.value)}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
               className="mt-5 text-sm text-white bg-green-600 font-semibold rounded-xl w-full lg:w-1/2 h-12"
            >
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>
                  <span>Sending for approval...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Send for approval</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default AddRequisitionForm;
