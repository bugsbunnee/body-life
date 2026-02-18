import type React from 'react';
import http from '@/services/http.service';

import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';

import Conditional from '@/components/common/conditional';
import useDepartments from '@/hooks/useDepartments';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { InventoryCreateSchema, type IInventoryCreate } from './inventory-item';

import { getErrorMessage } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

type Props = { onAddInventoryItem: () => void };

const AddInventoryItemForm: React.FC<Props> = ({ onAddInventoryItem }) => {
   const department = useDepartments();

   const form = useForm<IInventoryCreate>({
      resolver: zodResolver(InventoryCreateSchema),
   });

   const mutation = useMutation({
      mutationFn: (inventoryItem: IInventoryCreate) => http.post('/api/inventory', inventoryItem),
      onSuccess: () => {
         toast('Success!', { description: 'Added the inventory item successfully' });

         form.reset();
         onAddInventoryItem();
      },
      onError: (error) => toast('Could not add the inventory item', { description: getErrorMessage(error) }),
   });

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit((inventoryItem) => mutation.mutate(inventoryItem))} className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
               <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Department</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                              <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                                 <SelectValue placeholder="Select Department" />
                              </SelectTrigger>
                           </FormControl>

                           <SelectContent>
                              {department.data.data.data.map((dept) => (
                                 <SelectItem key={dept._id} value={dept._id}>
                                    {dept.name}
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
                        <FormLabel className="text-sm text-dark font-medium">Inventory Item Name</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g Television" {...field} />
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
                        <FormLabel className="text-sm text-dark font-medium">Inventory Item Description</FormLabel>
                        <FormControl>
                           <Input className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full" placeholder="e.g Hisense 32 Inch Television" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Quantity</FormLabel>
                        <FormControl>
                           <Input
                              className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full"
                              placeholder="e.g 10"
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
                  name="unitPrice"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Unit Price</FormLabel>
                        <FormControl>
                           <Input
                              className="h-[3.5rem] rounded-lg border border-border px-4 shadow-none w-full"
                              placeholder="e.g 1000"
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
                  name="datePurchased"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm text-dark font-medium">Date Purchased</FormLabel>
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

            <Button
               type="submit"
               disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
               className="text-sm text-white bg-main  w-full font-semibold rounded-sm h-12"
            >
               <Conditional visible={mutation.isPending}>
                  <div className="animate-spin">
                     <FaSpinner />
                  </div>

                  <span>Adding Inventory Item...</span>
               </Conditional>

               <Conditional visible={!mutation.isPending}>Add Inventory Item</Conditional>
            </Button>
         </form>
      </Form>
   );
};

export default AddInventoryItemForm;
