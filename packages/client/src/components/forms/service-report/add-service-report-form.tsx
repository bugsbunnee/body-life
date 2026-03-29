import React from 'react';

import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { serviceReportSchema, type IServiceReport } from './service-report-schema';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Calendar } from '../../ui/calendar';
import { getErrorMessage } from '@/lib/utils';
import { createServiceReport } from '@/services/dashboard.service';

import Conditional from '@/components/common/conditional';
import SearchableSelect from '@/components/common/searchable-select';

import useUsers from '@/hooks/useUsers';
import useMessages from '@/hooks/useMessages';
import useQueryStore from '@/store/query';

interface Props {
   onAddServiceReport: () => void;
}

const AddServiceReportForm: React.FC<Props> = ({ onAddServiceReport }) => {
   const { onSetUser, onSetMessage } = useQueryStore();

   const users = useUsers();
   const messages = useMessages();

   const form = useForm<IServiceReport>({
      resolver: zodResolver(serviceReportSchema),
      defaultValues: {
         serviceDate: undefined,
         seatArrangementCount: 0,
         firstTimerCount: 0,
         offering: 0,
         counts: [{ time: '', round: 1, adults: 0, children: 0 }],
      },
   });

   const fields = useFieldArray({
      control: form.control,
      name: 'counts',
   });

   const mutation = useMutation({
      mutationFn: (data: IServiceReport) => createServiceReport(data),
      onSuccess: () => {
         toast('Saved the report successfully!');

         form.reset();
         onAddServiceReport();
      },
      onError: (error) =>
         toast('Could not upload the report', {
            description: getErrorMessage(error),
         }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((report) => mutation.mutate(report))} className="space-y-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
               <FormField
                  control={form.control}
                  name="serviceDate"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Service Date</FormLabel>
                        <FormControl>
                           <Popover>
                              <PopoverTrigger asChild>
                                 <FormControl>
                                    <Button variant="ghost" className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full">
                                       {field.value ? format(field.value, 'PPP') : <span>Select Service Date</span>}
                                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                 </FormControl>
                              </PopoverTrigger>

                              <PopoverContent className="w-auto p-0 z-50" align="start">
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
                  name="prepPrayers"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Preparatory Prayers Led By</FormLabel>

                        <FormControl>
                           <SearchableSelect
                              isTriggered={users.isFetching}
                              onTriggerSearch={(search: string) => onSetUser({ search })}
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
                  name="worship"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Worship Led By</FormLabel>

                        <FormControl>
                           <SearchableSelect
                              isTriggered={users.isFetching}
                              onTriggerSearch={(search: string) => onSetUser({ search })}
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
                  name="message"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Sermon Preached</FormLabel>

                        <FormControl>
                           <SearchableSelect
                              isTriggered={messages.isFetching}
                              onTriggerSearch={(title: string) => onSetMessage({ title })}
                              data={messages.data.data.data.map((message) => ({ label: message.title, value: message._id }))}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Select Sermon"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="seatArrangementCount"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Seat Arrangement Count</FormLabel>

                        <FormControl>
                           <Input
                              type="number"
                              className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full"
                              placeholder="Enter the number of seats arranged"
                              disabled={field.disabled}
                              name={field.name}
                              value={field.value}
                              onBlur={field.onBlur}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="firstTimerCount"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">First Timer Count</FormLabel>
                        <FormControl>
                           <Input
                              className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full"
                              placeholder="Enter the number of first timers"
                              disabled={field.disabled}
                              name={field.name}
                              value={field.value}
                              onBlur={field.onBlur}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="offering"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Total Offering Received (Cash)</FormLabel>
                        <FormControl>
                           <Input
                              className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full"
                              placeholder="Enter the total offering received"
                              disabled={field.disabled}
                              name={field.name}
                              value={field.value}
                              onBlur={field.onBlur}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div>
               {fields.fields.map((initialField, index) => (
                  <React.Fragment key={initialField.id}>
                     <div className="border-b-1 my-6"></div>

                     <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <FormField
                           control={form.control}
                           name={`counts.${index}.time`}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-sm text-dark font-medium">Time</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                       <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
                                          <SelectValue placeholder="Select Time Interval" />
                                       </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                       {countIntervals.map((interval) => (
                                          <SelectItem key={interval} value={interval}>
                                             {interval}
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
                           name={`counts.${index}.adults`}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-sm text-dark font-medium">Adults</FormLabel>
                                 <FormControl>
                                    <Input
                                       className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full"
                                       placeholder="Enter the total number of adults"
                                       disabled={field.disabled}
                                       name={field.name}
                                       value={field.value}
                                       onBlur={field.onBlur}
                                       onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name={`counts.${index}.children`}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel className="text-sm text-dark font-medium">Children</FormLabel>
                                 <FormControl>
                                    <Input
                                       className="h-[3.5rem] rounded-xl border border-border px-4 shadow-none w-full"
                                       placeholder="Enter the total number of children"
                                       disabled={field.disabled}
                                       name={field.name}
                                       value={field.value}
                                       onBlur={field.onBlur}
                                       onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <Button className="text-sm text-white bg-red-500 font-semibold rounded-xl w-full h-12" onClick={() => fields.remove(index)}>
                           Remove
                        </Button>
                     </div>

                     <Conditional visible={index !== fields.fields.length - 1}>
                        <div className="border-b-1 my-4"></div>
                     </Conditional>
                  </React.Fragment>
               ))}
            </div>

            <div className="border-b-1 my-4"></div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
               <Button
                  type="button"
                  onClick={() => fields.append({ round: fields.fields.length + 1, time: '', adults: 0, children: 0 })}
                  className="text-sm text-white bg-main font-semibold rounded-xl w-full lg:w-1/2 h-12"
               >
                  Add Count Record
               </Button>

               <Button
                  type="submit"
                  disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
                  className="text-sm text-white bg-green-600 font-semibold rounded-xl w-full lg:w-1/2 h-12"
               >
                  <Conditional visible={mutation.isPending}>
                     <div className="animate-spin">
                        <FaSpinner />
                     </div>
                     <span>Uploading Service Report...</span>
                  </Conditional>
                  <Conditional visible={!mutation.isPending}>Upload Service Report</Conditional>
               </Button>
            </div>
         </form>
      </Form>
   );
};

const countIntervals = ['17:00', '18:30', '19:30'];

export default AddServiceReportForm;
