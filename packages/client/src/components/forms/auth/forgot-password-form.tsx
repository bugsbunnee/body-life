import type React from 'react';

import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import Conditional from '@/components/common/conditional';

import { ForgotPasswordSchema, type IForgotPasswowrd } from './login-schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '../../../utils/constants';
import { forgotPassword } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/utils';

const ForgotPasswordForm: React.FC = () => {
   const form = useForm<IForgotPasswowrd>({
      resolver: zodResolver(ForgotPasswordSchema),
   });

   const auth = useMutation({
      mutationFn: (auth: IForgotPasswowrd) => forgotPassword(auth),
      onError: (error) => toast.error(getErrorMessage(error)),
      onSuccess: () => {
         toast.success('Password reset instructions have been sent to your email.');
         form.reset();
      },
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((data) => auth.mutate(data))} className="space-y-6 mt-10">
            <FormField
               control={form.control}
               name="email"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-sm text-dark font-medium">Email Address</FormLabel>
                     <FormControl>
                        <Input className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full" placeholder="e.g john@gmail.com" {...field} />
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

                  <span>Validating...</span>
               </Conditional>

               <Conditional visible={!auth.isPending}>Continue</Conditional>
            </Button>

            <div className="text-center">
               <Link className="text-main text-sm" to={APP_ROUTES.AUTH}>
                  Back to Login
               </Link>
            </div>
         </form>
      </Form>
   );
};

export default ForgotPasswordForm;
