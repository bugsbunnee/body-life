import type React from 'react';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import Conditional from '@/components/common/conditional';
import http from '@/services/http.service';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

import { userRoleSchema, type IUserRole } from './user-schema';
import { getErrorMessage } from '@/lib/utils';
import { UserRole } from '@/utils/entities';

type Props = { userId: string; onUpdateRole: () => void };

const UpdateUserRoleForm: React.FC<Props> = ({ userId, onUpdateRole }) => {
   const form = useForm<IUserRole>({
      resolver: zodResolver(userRoleSchema),
   });

   const mutation = useMutation({
      mutationFn: (user: IUserRole) => http.patch('/api/user/' + userId, user),
      onSuccess: (response) => {
         toast('Success!', { description: response.data.message });

         form.reset();
         onUpdateRole();
      },
      onError: (error) => toast('Could not update the user role', { description: getErrorMessage(error) }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((user) => mutation.mutate(user))} className="space-y-8">
            <FormField
               control={form.control}
               name="userRole"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Member Role</FormLabel>

                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                              <SelectValue placeholder="Select a role" />
                           </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                           {Object.values(UserRole).map((role) => (
                              <SelectItem key={role} value={role} className="capitalize">
                                 {role}
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
               className="text-sm text-white bg-main font-semibold rounded-sm h-12"
            >
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Updating Role...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Update Role</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default UpdateUserRoleForm;
