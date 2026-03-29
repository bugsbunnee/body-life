import type React from 'react';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import Conditional from '@/components/common/conditional';
import SearchableSelect from '@/components/common/searchable-select';

import useUsers from '@/hooks/useUsers';
import useQueryStore from '@/store/query';
import http from '../../../services/http.service';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { DepartmentCreateSchema, type IDepartmentCreate } from './department-schema';
import { getErrorMessage } from '@/lib/utils';

type Props = { onAddDepartment: () => void };

const AddDepartmentForm: React.FC<Props> = ({ onAddDepartment }) => {
   const users = useUsers();
   const query = useQueryStore();

   const form = useForm<IDepartmentCreate>({
      resolver: zodResolver(DepartmentCreateSchema),
   });

   const mutation = useMutation({
      mutationFn: (department: IDepartmentCreate) => http.post('/api/department', { ...department, hod: department.hod.value }),
      onSuccess: () => {
         toast('Success!', { description: 'Added the department successfully' });

         form.reset();
         onAddDepartment();
      },
      onError: (error) => toast('Could not add the department', { description: getErrorMessage(error) }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((department) => mutation.mutate(department))} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
               <FormField
                  control={form.control}
                  name="hod"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Department Head</FormLabel>

                        <FormControl>
                           <SearchableSelect
                              isTriggered={users.isFetching}
                              onTriggerSearch={(search: string) => query.onSetUser({ search })}
                              data={users.data.data.data.map((user) => ({ label: user.firstName + ' ' + user.lastName, value: user._id }))}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select Leader"
                           />
                        </FormControl>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Department Name</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full" placeholder="e.g Media" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
               className="text-sm text-white bg-main  w-full font-semibold rounded-xl h-12"
            >
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Adding Department...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Add Department</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default AddDepartmentForm;
