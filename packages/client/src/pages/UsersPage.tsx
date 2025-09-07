import type React from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';

import Header from '@/components/common/header';
import Filters from '@/components/common/filters';
import useUsers from '@/hooks/useUsers';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DatePickerDemo } from '@/components/ui/datepicker';
import { DataTable } from '@/components/ui/datatable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getInitials } from '@/lib/utils';
import type { User } from '@/utils/entities';

const columns: ColumnDef<User>[] = [
   {
      accessorKey: 'id',
      header: 'Avatar',
      cell: ({ row }) => (
         <Avatar>
            <AvatarFallback>{getInitials(row.original.firstName + ' ' + row.original.lastName)}</AvatarFallback>
         </Avatar>
      ),
   },
   {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => (
         <span>
            {row.original.firstName} {row.original.lastName}
         </span>
      ),
   },
   {
      accessorKey: 'address',
      header: 'Address',
   },
   {
      accessorKey: 'phoneNumber',
      header: 'Phone',
   },
   {
      accessorKey: 'email',
      header: 'Email',
   },
];

const UsersPage: React.FC = () => {
   const { isFetching, data } = useUsers();

   return (
      <>
         <Header title="Members" />

         <Tabs defaultValue="account" className="w-full pt-8 gap-0">
            <TabsList className="w-full bg-transparent border-b-border border-b justify-start">
               <TabsTrigger
                  className="max-w-fit p-4 text-base text-gray-500 font-medium data-[state=active]:shadow-none data-[state=active]:rounded-none data-[state=active]:text-main data-[state=active]:bg-blue-light data-[state=active]:border-b-main"
                  value="workforce"
               >
                  Workforce
               </TabsTrigger>

               <TabsTrigger
                  className="max-w-fit px-4 text-base text-gray-500 font-medium data-[state=active]:shadow-none data-[state=active]:rounded-none data-[state=active]:text-main data-[state=active]:bg-blue-light data-[state=active]:border-b-main"
                  value="non-workforce"
               >
                  Non-Workforce
               </TabsTrigger>
            </TabsList>

            <div className="p-6 border-b-border border-b flex items-center justify-between">
               <div className="">
                  <div className="text-base text-black font-semibold">Members Chart</div>
                  <div className="text-base text-gray-neutral mt-[0.25rem]">Track the activities of your members</div>
               </div>

               <div className="flex gap-x-4">
                  <DatePickerDemo />

                  <Button
                     variant="ghost"
                     className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
                  >
                     <PlusIcon />
                     <span className="flex-1">Add New</span>
                  </Button>
               </div>
            </div>

            <Filters />

            <TabsContent value="account">
               <DataTable loading={isFetching} columns={columns} data={data.data} />
            </TabsContent>
         </Tabs>
      </>
   );
};

export default UsersPage;
