import type React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';

import Conditional from '@/components/common/conditional';
import useAuthStore from '@/store/auth';

import { LoginSchema, type ILogin } from './login-schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '../../../utils/constants';
import { authenticate } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/utils';

const LoginForm: React.FC = () => {
   const authStore = useAuthStore();
   const navigate = useNavigate();

   const form = useForm<ILogin>({
      resolver: zodResolver(LoginSchema),
   });

   const auth = useMutation({
      mutationFn: (auth: ILogin) => authenticate(auth.email, auth.password),
      onSuccess: (response) => {
         authStore.login(response.data);
         navigate(APP_ROUTES.DASHBOARD);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
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

            <FormField
               control={form.control}
               name="password"
               render={({ field, fieldState }) => (
                  <FormItem>
                     <FormLabel className="text-sm text-dark font-medium">Password</FormLabel>
                     <FormControl>
                        <InputGroup className="h-[3.5rem] rounded-xl border border-border px-2 shadow-none w-full">
                           <InputGroupInput {...field} id={field.name} type="password" aria-invalid={fieldState.invalid} placeholder="Enter your password" autoComplete="off" />

                           <InputGroupAddon align="inline-end">
                              <EyeOffIcon className="text-base" />
                           </InputGroupAddon>
                        </InputGroup>
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

                  <span>Authenticating...</span>
               </Conditional>

               <Conditional visible={!auth.isPending}>Login</Conditional>
            </Button>

            <div className="text-center">
               <Link className="text-main text-sm" to={APP_ROUTES.FORGOT_PASSWORD}>
                  Forgot your password? Contact Admin
               </Link>
            </div>
         </form>
      </Form>
   );
};

export default LoginForm;
