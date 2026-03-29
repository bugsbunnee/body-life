import React from 'react';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REQUISITION_STATUS } from '@/utils/constants';

import { requisitionUpdateSchema, type IRequisitionUpdate } from './requisition-schema';
import { getErrorMessage } from '@/lib/utils';

import Conditional from '@/components/common/conditional';
import http from '@/services/http.service';

interface Props {
   requisitionId: string;
   onUpdateRequisition: () => void;
}

const UpdateRequisitionForm: React.FC<Props> = ({ requisitionId, onUpdateRequisition }) => {
   const form = useForm<IRequisitionUpdate>({
      resolver: zodResolver(requisitionUpdateSchema),
   });

   const mutation = useMutation({
      mutationFn: (data: IRequisitionUpdate) => http.post('/api/requisition/' + requisitionId + '/action', data),
      onSuccess: () => {
         toast('The requisition has been updated successfully!');

         form.reset();
         onUpdateRequisition();
      },
      onError: (error) =>
         toast('Could not update the requisition', {
            description: getErrorMessage(error),
         }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((report) => mutation.mutate(report))} className="space-y-8">
            <FormField
               control={form.control}
               name="status"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Requisition Status</FormLabel>

                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
                              <SelectValue placeholder="Select a Requisition Status" />
                           </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                           {REQUISITION_STATUS.map((status) => (
                              <SelectItem key={status.id} value={status.id}>
                                 {status.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
               className="mt-5 text-sm text-white bg-green-600 font-semibold rounded-xl w-full lg:w-1/2 h-12"
            >
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>
                  <span>Updating requisition status...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Update Status</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default UpdateRequisitionForm;
