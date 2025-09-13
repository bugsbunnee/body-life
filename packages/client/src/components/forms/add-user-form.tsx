import type React from 'react';
import axios from 'axios';

import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { getErrorMessage } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const userSchema = z.object({
   firstName: z.string().min(1, 'First Name is required').max(30, 'First Name is too long (max 30 characters'),
   lastName: z.string().min(1, 'Last Name is required').max(30, 'Last Name is too long (max 30 characters'),
   address: z.string().min(1, 'Address is required').max(200, 'Address is too long (max 200 characters'),
   gender: z.string().min(1, 'Gender is required').max(200, 'Gender is too long (max 200 characters'),
   maritalStatus: z.string().min(1, 'Marital Status is required').max(20, 'Marital Status is too long (max 20 characters'),
   email: z.email().min(1, 'Email Address is required').max(200, 'Email Address is too long (max 50 characters'),
   birthDay: z.date(),
   phoneNumber: z.string().refine((value) => isValidPhoneNumber(value, 'NG'), 'Please enter a valid phone number'),
});

type IUser = z.infer<typeof userSchema>;

type Props = { onAddUser: () => void };

const AddUserForm: React.FC<Props> = ({ onAddUser }) => {
   const form = useForm<IUser>({
      resolver: zodResolver(userSchema),
   });

   const mutation = useMutation({
      mutationFn: (user: IUser) => axios.post('/api/user', user),
      onSuccess: (response) => {
         toast('Success!', {
            description: response.data.message,
         });

         form.reset();
         onAddUser();
      },
      onError: (error) =>
         toast('Could not add the user', {
            description: getErrorMessage(error),
         }),
   });

   const handleCreateUser = (user: IUser) => {
      mutation.mutate(user);
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-8">
            <div className="grid grid-cols-2 gap-x-5">
               <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">First Name</FormLabel>
                        <FormControl>
                           <Input
                              className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full"
                              placeholder="e.g John"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Last Name</FormLabel>
                        <FormControl>
                           <Input
                              className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full"
                              placeholder="e.g Doe"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="grid grid-cols-3 gap-x-5">
               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Email Address</FormLabel>
                        <FormControl>
                           <Input
                              className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full"
                              placeholder="e.g john@gmail.com"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger
                                 style={{ height: '3.5rem' }}
                                 className="rounded-lg border border-border px-4 shadow-none w-full"
                              >
                                 <SelectValue placeholder="Select a Gender" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {GENDERS.map((gender) => (
                                 <SelectItem key={gender.id} value={gender.id}>
                                    {gender.name}
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
                  name="maritalStatus"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger
                                 style={{ height: '3.5rem' }}
                                 className="rounded-lg border border-border px-4 shadow-none w-full"
                              >
                                 <SelectValue placeholder="Select a Marital Status" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {MARITAL_STATUS.map((status) => (
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
            </div>

            <div className="grid grid-cols-3 gap-x-5">
               <FormField
                  control={form.control}
                  name="birthDay"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Date of Birth</FormLabel>
                        <FormControl>
                           <Popover>
                              <PopoverTrigger asChild>
                                 <FormControl>
                                    <Button variant="ghost" className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full">
                                       {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                 </FormControl>
                              </PopoverTrigger>

                              <PopoverContent className="w-auto p-0" align="start">
                                 <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                    captionLayout="dropdown"
                                 />
                              </PopoverContent>
                           </Popover>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Phone Number</FormLabel>
                        <FormControl>
                           <Input
                              className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full"
                              placeholder="e.g 08142317489"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder="Where do they live?"
                              className="resize-none rounded-lg border border-border p-4 shadow-none w-full"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting}
               className="text-sm text-white bg-main font-semibold rounded-sm w-full max-w-36 h-12"
            >
               {form.formState.isSubmitting ? 'Adding Member...' : 'Add Member'}
            </Button>
         </form>
      </Form>
   );
};

const GENDERS = [
   {
      id: 'Male',
      name: 'Male',
   },
   {
      id: 'Female',
      name: 'Female',
   },
];

const MARITAL_STATUS = [
   {
      id: 'Single',
      name: 'Single',
   },
   {
      id: 'Married',
      name: 'Married',
   },
];

export default AddUserForm;
