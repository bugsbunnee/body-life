import type React from 'react';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import http from '../../../services/http.service';
import Conditional from '@/components/common/conditional';
import useUsers from '@/hooks/useUsers';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { DepartmentCreateSchema, type IDepartmentCreate } from './department-schema';

import { getErrorMessage } from '@/lib/utils';

type Props = { onAddDepartment: () => void };

const AddDepartmentForm: React.FC<Props> = ({ onAddDepartment }) => {
   const users = useUsers();

   const form = useForm<IDepartmentCreate>({
      resolver: zodResolver(DepartmentCreateSchema),
   });

   const mutation = useMutation({
      mutationFn: (department: IDepartmentCreate) => http.post('/api/department', department),
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
            <div className="grid grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="hod"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Department Head</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="Select Leader" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {users.data.data.data.map((user) => (
                                 <SelectItem key={user._id} value={user._id}>
                                    {user.firstName} {user.lastName}
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
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Department Name</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g Media" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
               className="text-sm text-white bg-main  w-full font-semibold rounded-sm h-12"
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
