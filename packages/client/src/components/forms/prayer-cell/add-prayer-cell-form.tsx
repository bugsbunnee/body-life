import type React from 'react';
import http from '@/services/http.service';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import Conditional from '@/components/common/conditional';
import useUsers from '@/hooks/useUsers';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../../ui/textarea';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { PrayerCellCreateSchema, type IPrayerCellCreate } from './prayer-cell-schema';

import { getErrorMessage } from '@/lib/utils';
import { MEETING_DAYS, MEETING_TIMES } from '@/utils/constants';

type Props = { onAddPrayerCell: () => void };

const AddPrayerCellForm: React.FC<Props> = ({ onAddPrayerCell }) => {
   const users = useUsers();

   const form = useForm<IPrayerCellCreate>({
      resolver: zodResolver(PrayerCellCreateSchema),
   });

   const mutation = useMutation({
      mutationFn: (prayerCell: IPrayerCellCreate) => http.post('/api/prayer-cell', prayerCell),
      onSuccess: () => {
         toast('Success!', { description: 'Added the prayer cell successfully' });

         form.reset();
         onAddPrayerCell();
      },
      onError: (error) => toast('Could not add the prayer cell', { description: getErrorMessage(error) }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((prayerCell) => mutation.mutate(prayerCell))} className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
               <FormField
                  control={form.control}
                  name="leader"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Prayer Cell Leader</FormLabel>

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
                        <FormLabel className="text-sm text-dark font-medium">Prayer Cell Name</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g Abijo Prayer Cell" {...field} />
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
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                           <Textarea rows={6} placeholder="Enter the address" className="resize-none rounded-lg border border-border p-4 shadow-none w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="grid grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="meetingDay"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Meeting Day</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="Select Meeting Day" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {MEETING_DAYS.map((day) => (
                                 <SelectItem key={day.id} value={day.id}>
                                    {day.name}
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
                  name="meetingTime"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Meeting Time</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="Select Meeting Day" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {MEETING_TIMES.map((day) => (
                                 <SelectItem key={day.id} value={day.id}>
                                    {day.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>

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

                  <span>Adding Prayer Cell...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Add Prayer Cell</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default AddPrayerCellForm;
