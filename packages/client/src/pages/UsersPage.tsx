import type React from 'react';

import { useEffect, useMemo, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { formatDate } from 'date-fns';

import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/utils/entities';
import { getInitials } from '@/lib/utils';

import AddUserForm from '@/components/forms/add-user-form';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import Summary from '@/components/common/summary';
import SendMessageForm from '@/components/forms/send-message-form';

import useUsers from '@/hooks/useUsers';
import useQueryStore from '@/store/query';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/datepicker';
import { DataTable } from '@/components/ui/datatable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

const UsersPage: React.FC = () => {
   const [isAddUserVisible, setAddUserVisible] = useState(false);
   const [selectedUser, setSelectedUser] = useState<User | null>(null);

   const { isFetching, data, refetch } = useUsers();
   const { onSetSearch, onSetPageNumber, resetQuery } = useQueryStore();

   const handleMemberAddition = () => {
      setAddUserVisible(false);
      refetch();
   };

   const columns = useMemo(() => {
      const columns: ColumnDef<User>[] = [
         {
            accessorKey: 'createdAt',
            header: ({ table }) => (
               <Checkbox
                  checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
               />
            ),
            cell: ({ row }) => (
               <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
            enableSorting: false,
            enableHiding: false,
         },
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
            header: 'Full Name',
            cell: ({ row }) => (
               <Button
                  onClick={() => setSelectedUser(row.original)}
                  className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
               >
                  {row.original.firstName} {row.original.lastName}
               </Button>
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

      return columns;
   }, []);

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <>
         <Header title="Members" onSearch={onSetSearch} />

         <Modal onClose={() => setAddUserVisible(false)} title="Add User" visible={isAddUserVisible}>
            <AddUserForm onAddUser={handleMemberAddition} />
         </Modal>

         {selectedUser && (
            <Modal onClose={() => setSelectedUser(null)} title="User Details" visible>
               <div className="grid grid-cols-2 gap-4">
                  <Summary
                     title="General Information"
                     labels={[
                        {
                           key: 'First Name',
                           value: selectedUser.firstName,
                        },
                        {
                           key: 'Last Name',
                           value: selectedUser.lastName,
                        },
                        {
                           key: 'Email Address',
                           value: selectedUser.email,
                        },
                        {
                           key: 'Phone Number',
                           value: selectedUser.phoneNumber,
                        },
                     ]}
                  />

                  <Summary
                     title="Others"
                     labels={[
                        {
                           key: 'Home Address',
                           value: selectedUser.address,
                        },
                        {
                           key: 'Birthday',
                           value: formatDate(selectedUser.birthDay, 'PPP'),
                        },
                        {
                           key: 'Notes',
                           value: selectedUser.notes,
                        },
                     ]}
                  />

                  <SendMessageForm phoneNumber={selectedUser.phoneNumber} />
               </div>
            </Modal>
         )}

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
                  <DatePicker />

                  <Button
                     onClick={() => setAddUserVisible(true)}
                     variant="ghost"
                     className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
                  >
                     <PlusIcon />
                     <span className="flex-1">Add New</span>
                  </Button>
               </div>
            </div>

            <TabsContent value="account">
               <DataTable
                  onPageChange={onSetPageNumber}
                  pagination={data.data.pagination}
                  loading={isFetching}
                  columns={columns}
                  data={data.data.data}
               />
            </TabsContent>
         </Tabs>
      </>
   );
};

export default UsersPage;
