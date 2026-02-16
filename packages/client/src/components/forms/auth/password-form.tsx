import type React from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import Conditional from '@/components/common/conditional';

import { PasswordSchema, type IPassword } from './login-schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updatePassword } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/utils';

import { APP_ROUTES } from '../../../utils/constants';

const PasswordForm: React.FC = () => {
   const params = useSearchParams();
   const navigate = useNavigate();

   const form = useForm<IPassword>({
      resolver: zodResolver(PasswordSchema),
      defaultValues: {
         token: params[0].get('token') ?? undefined,
      },
   });

   const auth = useMutation({
      mutationFn: (password: IPassword) => updatePassword(password),
      onSuccess: (response) => {
         toast.success(response.data.message);
         navigate(APP_ROUTES.AUTH);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((data) => auth.mutate(data))} className="space-y-6 mt-10">
            <FormField
               control={form.control}
               name="password"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-sm text-dark font-medium">Password</FormLabel>
                     <FormControl>
                        <Input type="password" className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="Enter your password" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="confirmPassword"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-sm text-dark font-medium">Confirm Password</FormLabel>
                     <FormControl>
                        <Input type="password" className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="Confirm your password" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting || auth.isPending}
               className="text-sm text-white bg-main font-semibold rounded-sm w-full h-12"
            >
               <Conditional visible={auth.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Updating Password...</span>
               </Conditional>

               <Conditional visible={!auth.isPending}>Update</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default PasswordForm;
