import type React from 'react';
import axios from 'axios';

import { format } from 'date-fns';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import Conditional from '@/components/common/conditional';
import useUsers from '@/hooks/useUsers';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../../ui/calendar';
import { getErrorMessage } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSpinner } from 'react-icons/fa';

const messageSchema = z.object({
   title: z.string().min(1, 'Title is required').max(55, 'Title is too long (max 100 characters'),
   preacher: z.string().min(1, 'Preacher name is required').max(255, 'Preacher name is too long (max 30 characters'),
   date: z.date().max(new Date()),
   videoUrl: z.url().min(1, 'Video URL is required'),
});

type IMessage = z.infer<typeof messageSchema>;

type Props = { onAddMessage: () => void };

const UploadMessageForm: React.FC<Props> = ({ onAddMessage }) => {
   const users = useUsers();

   const form = useForm<IMessage>({
      resolver: zodResolver(messageSchema),
   });

   const mutation = useMutation({
      mutationFn: (message: IMessage) => axios.post('/api/message', message),
      onSuccess: (response) => {
         toast('Success!', { description: response.data.message });

         form.reset();
         onAddMessage();
      },
      onError: (error) =>
         toast('Could not upload the messsage', {
            description: getErrorMessage(error),
         }),
   });

   const handleCreateMessage = (message: IMessage) => {
      mutation.mutate(message);
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(handleCreateMessage)} className="space-y-8">
            <div className="grid grid-cols-2 gap-x-5">
               <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Title</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g Posture of the Blessed" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="preacher"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Preacher</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="Select Preacher" />
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
            </div>

            <div className="grid grid-cols-2 gap-x-5">
               <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Sermon URL (YouTube):</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="YouTube Video URL" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Date Preached</FormLabel>
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
            </div>

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
               className="text-sm text-white bg-main font-semibold rounded-sm w-full h-12"
            >
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Uploading Message...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Upload Message</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default UploadMessageForm;
