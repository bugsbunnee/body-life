import React, { useEffect } from 'react';
import dayjs from 'dayjs';

import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';

import Conditional from '@/components/common/conditional';
import SearchableSelect from '@/components/common/searchable-select';
import http from '@/services/http.service';

import useDepartments from '@/hooks/useDepartments';
import usePrayerCells from '@/hooks/usePrayerCells';
import useQueryStore from '@/store/query';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Calendar } from '../../ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '../../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

import type { User } from '@/utils/entities';

import { userUpdateSchema, type IUserUpdate } from './user-schema';
import { getErrorMessage } from '@/lib/utils';
import { GENDERS, MARITAL_STATUS } from '@/utils/constants';

type Props = { user: User; onUpdateUser: () => void };

const UpdateUserForm: React.FC<Props> = ({ user, onUpdateUser }) => {
   const prayerCells = usePrayerCells();
   const departments = useDepartments();

   const { onSetDepartment } = useQueryStore();

   const form = useForm<IUserUpdate>({
      resolver: zodResolver(userUpdateSchema),
   });

   const mutation = useMutation({
      mutationFn: (updatedUser: IUserUpdate) =>
         http.put('/api/user/' + user._id, {
            ...updatedUser,
            department: updatedUser.department ? updatedUser.department.value : undefined,
            prayerCell: updatedUser.prayerCell ? updatedUser.prayerCell.value : undefined,
         }),
      onSuccess: (response) => {
         toast('Success! You have updated the member details successfully!', { description: response.data.message });

         form.reset();
         onUpdateUser();
      },
      onError: (error) => toast('Could not update the member details', { description: getErrorMessage(error) }),
   });

   useEffect(() => {
      if (user) {
         form.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: dayjs(user.dateOfBirth).toDate(),
            maritalStatus: user.maritalStatus,
            gender: user.gender,
            prayerCell: user.prayerCell ? { label: user.prayerCell.name, value: user.prayerCell._id } : undefined,
            department: user.department ? { label: user.department.name, value: user.department._id } : undefined,
         });
      }
   }, [form, user]);

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((user) => mutation.mutate(user))} className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
               <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">First Name</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g John" {...field} />
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
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Email Address</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g john@gmail.com" {...field} />
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
                           <Textarea rows={6} placeholder="Where do they live?" className="resize-none rounded-lg border border-border p-4 shadow-none w-full" {...field} />
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
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g 08142317489" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="dateOfBirth"
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
            </div>

            <div className="mt-3 grid grid-cols-4 gap-6">
               <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Gender</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
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

                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
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

               <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Department (Optional)</FormLabel>

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
                  name="prayerCell"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Prayer Cell (Optional)</FormLabel>

                        <FormControl>
                           <SearchableSelect
                              isTriggered={prayerCells.isFetching}
                              onTriggerSearch={(name: string) => onSetDepartment({ name })}
                              data={prayerCells.data.data.data.map((cell) => ({ label: cell.name, value: cell._id }))}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select Prayer Cell"
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
               className="text-sm text-white bg-main font-semibold rounded-sm h-12"
            >
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Updating Member Details...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Update Member Details</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default UpdateUserForm;
