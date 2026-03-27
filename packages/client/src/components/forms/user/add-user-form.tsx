import type React from 'react';

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
import useUsers from '@/hooks/useUsers';
import usePrayerCells from '@/hooks/usePrayerCells';
import useServiceReports from '@/hooks/useServiceReports';
import useQueryStore from '@/store/query';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Calendar } from '../../ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '../../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

import { userSchema, type IUser } from './user-schema';
import { getErrorMessage } from '@/lib/utils';
import { CONTACT_METHODS, GENDERS, MARITAL_STATUS } from '@/utils/constants';

type Props = { onAddUser: () => void };

const AddUserForm: React.FC<Props> = ({ onAddUser }) => {
   const prayerCells = usePrayerCells();
   const departments = useDepartments();
   const users = useUsers();
   const services = useServiceReports();

   const { onSetDepartment } = useQueryStore();

   const form = useForm<IUser>({
      resolver: zodResolver(userSchema),
   });

   const mutation = useMutation({
      mutationFn: (user: IUser) =>
         http.post('/api/user', {
            ...user,
            assignTo: user.assignTo ? user.assignTo.value : undefined,
            serviceAttended: user.serviceAttended ? user.serviceAttended.value : undefined,
            department: user.department ? user.department.value : undefined,
            prayerCell: user.prayerCell ? user.prayerCell.value : undefined,
         }),
      onSuccess: (response) => {
         toast('Success!', { description: response.data.message });

         form.reset();
         onAddUser();
      },
      onError: (error) => toast('Could not add the user', { description: getErrorMessage(error) }),
   });

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
                           <Input className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full" placeholder="e.g John" {...field} />
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
                           <Input className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full" placeholder="e.g Doe" {...field} />
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
                           <Input className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full" placeholder="e.g john@gmail.com" {...field} />
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
                           <Textarea rows={6} placeholder="Where do they live?" className="resize-none rounded-xl border border-border p-4 shadow-none w-full" {...field} />
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
                           <Input className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full" placeholder="e.g 08142317489" {...field} />
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
                                    <Button variant="ghost" className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full">
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
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
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
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

            <FormField
               control={form.control}
               defaultValue={false}
               name="isFirstTimer"
               render={({ field }) => (
                  <div className="bg-slate-50 h-[3.5rem] flex items-center px-4 rounded-md border border-border">
                     <FormItem className="col-span-2 flex items-center gap-x-4">
                        <FormLabel htmlFor={field.name}>Is First Timer?</FormLabel>

                        <FormControl>
                           <Checkbox id={field.name} name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                     </FormItem>
                  </div>
               )}
            />

            <Conditional visible={form.watch('isFirstTimer')}>
               <div className="grid grid-cols-3 gap-6">
                  <FormField
                     control={form.control}
                     name="assignTo"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-sm text-dark font-medium">Assign For Follow Up</FormLabel>

                           <FormControl>
                              <SearchableSelect
                                 isTriggered={users.isFetching}
                                 onTriggerSearch={(name: string) => onSetDepartment({ name })}
                                 data={users.data.data.data.map((user) => ({ label: user.firstName + ' ' + user.lastName, value: user._id }))}
                                 value={field.value}
                                 onValueChange={field.onChange}
                                 placeholder="Select Member"
                              />
                           </FormControl>

                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="serviceAttended"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-sm text-dark font-medium">Service Attended</FormLabel>

                           <FormControl>
                              <SearchableSelect
                                 isTriggered={services.isFetching}
                                 onTriggerSearch={(name: string) => onSetDepartment({ name })}
                                 data={services.data.data.map((service) => ({ label: service.message.title, value: service._id }))}
                                 value={field.value}
                                 onValueChange={field.onChange}
                                 placeholder="Select Member"
                              />
                           </FormControl>

                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="preferredContactMethod"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-sm text-dark font-medium">Preferred Contact Method</FormLabel>

                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                 <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
                                    <SelectValue placeholder="Select Preferred Contact Method" />
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 {CONTACT_METHODS.map((method) => (
                                    <SelectItem key={method.id} value={method.id}>
                                       {method.name}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>

                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                           <Textarea
                              rows={6}
                              placeholder="Any thing to note like a prayer request?"
                              className="resize-none rounded-xl border border-border p-4 shadow-none w-full"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </Conditional>

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
               className="text-sm text-white bg-main font-semibold rounded-sm h-12"
            >
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Adding Member...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Add Member</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default AddUserForm;
