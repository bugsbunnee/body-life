import React from 'react';

import Conditional from '@/components/common/conditional';
import Upload from '@/components/common/upload';
import http from '@/services/http.service';

import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { useMutation } from '@tanstack/react-query';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ProgramCreateSchema, type IProgramCreate } from './program-schema';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { getErrorMessage } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';

interface Props {
   onCreateProgram: () => void;
}

const AddProgramForm: React.FC<Props> = ({ onCreateProgram }) => {
   const form = useForm<IProgramCreate>({
      resolver: zodResolver(ProgramCreateSchema),
   });

   const mutation = useMutation({
      mutationFn: (program: FormData) => http.post(`/api/program`, program),
      onError: (error) => toast('Could not create the program', { description: getErrorMessage(error), className: 'text-dark' }),
      onSuccess: (response) => {
         toast('Success!', { description: response.data.message });
         onCreateProgram();
      },
   });

   const handleCreateProgram = (program: IProgramCreate) => {
      const formData = new FormData();

      formData.append('file', program.file);
      formData.append('title', program.title);
      formData.append('description', program.description);
      formData.append('address', program.address);
      formData.append('scheduledFor', format(program.scheduledFor, 'yyyy-MM-dd'));

      mutation.mutate(formData);
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(handleCreateProgram)} className="space-y-4">
            <FormField
               control={form.control}
               name="file"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-sm text-dark font-medium">Flyer</FormLabel>
                     <FormControl>
                        <Upload file={field.value} onUploadFile={(files) => field.onChange(files[0])} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="grid grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Title</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g Thanksgiving Service" {...field} />
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
                        <FormLabel className="text-sm text-dark font-medium">Address</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="Enter address" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                           <Textarea rows={6} placeholder="Enter the description" className="resize-none rounded-lg border border-border p-4 shadow-none w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="scheduledFor"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Scheduled Date</FormLabel>
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
                                 <Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown" />
                              </PopoverContent>
                           </Popover>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting} className="mt-6 text-sm text-white bg-main font-semibold rounded-sm w-full h-12">
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Creating Program...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Create Program</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default AddProgramForm;
