import type React from 'react';
import axios from 'axios';

import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon } from 'lucide-react';
import { FaSpinner } from 'react-icons/fa';

import Conditional from '@/components/common/conditional';
import useUsers from '@/hooks/useUsers';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Calendar } from '../../ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '../../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { FirstTimerUpdateSchema, type IFirstTimerUpdate } from './first-timer-schema';

import { getErrorMessage } from '@/lib/utils';
import { CONTACT_METHODS, FOLLOW_UP_FEEDBACK_STATUS } from '@/utils/constants';

type Props = { firstTimerId: string; onUpdateFirstTimer: () => void };

const UpdateFollowUpForm: React.FC<Props> = ({ firstTimerId, onUpdateFirstTimer }) => {
   const users = useUsers();

   const form = useForm<IFirstTimerUpdate>({
      resolver: zodResolver(FirstTimerUpdateSchema),
   });

   const mutation = useMutation({
      mutationFn: (firstTimer: IFirstTimerUpdate) => axios.put('/api/followup/' + firstTimerId, firstTimer),
      onSuccess: (response) => {
         toast('Success!', { description: response.data.message });

         form.reset();
         onUpdateFirstTimer();
      },
      onError: (error) => toast('Could not add the user', { description: getErrorMessage(error) }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((firstTimer) => mutation.mutate(firstTimer))} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="contactedAt"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">When Were They Contacted?</FormLabel>
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
                  name="contactedBy"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Who Contacted Them?</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="Select Contacted By" />
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
                  name="channel"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">How Did You Reach Them?</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
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

               <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">What is the Current Status?</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="Select Current Status" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {FOLLOW_UP_FEEDBACK_STATUS.map((status) => (
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

            <div className="grid grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="successful"
                  render={({ field }) => (
                     <div className="bg-slate-50 h-[3.5rem] flex items-center px-4 rounded-md border border-border">
                        <FormItem className="col-span-2 flex items-center gap-x-4">
                           <FormLabel htmlFor={field.name}>Did You Successfully Reach Them?</FormLabel>

                           <FormControl>
                              <Checkbox id={field.name} name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                        </FormItem>
                     </div>
                  )}
               />

               <FormField
                  control={form.control}
                  name="wantsToJoinDepartment"
                  render={({ field }) => (
                     <div className="bg-slate-50 h-[3.5rem] flex items-center px-4 rounded-md border border-border">
                        <FormItem className="col-span-2 flex items-center gap-x-4">
                           <FormLabel htmlFor={field.name}>Would They Like to Join A Department?</FormLabel>

                           <FormControl>
                              <Checkbox id={field.name} name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                           </FormControl>
                        </FormItem>
                     </div>
                  )}
               />
            </div>

            <FormField
               control={form.control}
               name="response"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>What Was Their Feedback</FormLabel>
                     <FormControl>
                        <Textarea rows={6} placeholder="What did they say?" className="resize-none rounded-lg border border-border p-4 shadow-none w-full" {...field} />
                     </FormControl>
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

                  <span>Updating Record...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Update Record</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default UpdateFollowUpForm;
