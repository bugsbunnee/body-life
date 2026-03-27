import type React from 'react';

import { useEffect, useMemo, useState } from 'react';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon, SendIcon } from 'lucide-react';
import { formatDate } from 'date-fns';
import { cn, exportToExcel, getErrorMessage, getInitials } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ColumnDef } from '@tanstack/react-table';
import { UserRole, type User } from '@/utils/entities';
import { FaSpinner } from 'react-icons/fa';

import AddUserForm from '@/components/forms/user/add-user-form';
import Conditional from '@/components/common/conditional';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import Role from '@/components/common/role';
import Summary from '@/components/common/summary';
import SearchableSelect from '@/components/common/searchable-select';
import SendMessageForm from '@/components/forms/message/send-message-form';
import UpdateUserRoleForm from '@/components/forms/user/update-user-role-form';
import UpdateUserForm from '@/components/forms/user/update-user-form';

import useDepartments from '@/hooks/useDepartments';
import usePrayerCells from '@/hooks/usePrayerCells';
import useUsers from '@/hooks/useUsers';
import useAuthStore from '@/store/auth';
import useQueryStore from '@/store/query';

import http from '@/services/http.service';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/datatable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GENDERS, MARITAL_STATUS, OPTIONS } from '@/utils/constants';

const UsersPage: React.FC = () => {
   const [isAddUserVisible, setAddUserVisible] = useState(false);
   const [isSendMessageVisible, setSendMessageVisible] = useState(false);
   const [selectedUserToView, setSelectedUserToView] = useState<User | null>(null);
   const [selectedUserToUpdate, setSelectedUserToUpdate] = useState<User | null>(null);
   const [selectedUserRole, setSelectedUserRole] = useState<User | null>(null);

   const { isFetching, data, refetch } = useUsers();
   const { data: prayerCells, isFetching: isFetchingPrayerCells } = usePrayerCells();
   const { data: departments, isFetching: isFetchingDepartments } = useDepartments();

   const { auth } = useAuthStore();
   const { userQuery, onSetDepartment, onSetUser, onSetPrayerCell, resetQuery } = useQueryStore();

   const mutation = useMutation({
      mutationFn: (user: string) => http.post('/api/auth/admin/assign', { user }),
      onSuccess: (response) => toast.success(response.data.message),
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const handleMemberAddition = () => {
      setAddUserVisible(false);
      setSelectedUserRole(null);
      setSelectedUserToUpdate(null);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.data.map((datum) => ({
         firstName: datum.firstName,
         lastName: datum.lastName,
         email: datum.email,
         phoneNumber: datum.phoneNumber,
         address: datum.address,
         dateOfBirth: formatDate(datum.dateOfBirth, 'PPP'),
         isFirstTimer: datum.isFirstTimer ? 'Yes' : 'No',
      }));

      exportToExcel(extractedData, `Members_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   const columns = useMemo(() => {
      const columns: ColumnDef<User>[] = [
         {
            accessorKey: 'dateOfBirth',
            header: ({ table }) => (
               <Checkbox
                  checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                  onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                  aria-label="Select all"
               />
            ),
            cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
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
                  onClick={() => setSelectedUserToView(row.original)}
                  className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
               >
                  {row.original.firstName} {row.original.lastName}
               </Button>
            ),
         },
         {
            accessorKey: 'isFirstTimer',
            header: 'Is First Timer',
            cell: ({ row }) => (
               <Badge
                  className={cn({
                     capitalize: true,
                     'bg-red-600': !row.original.isFirstTimer,
                     'bg-green-600': row.original.isFirstTimer,
                  })}
               >
                  {row.original.isFirstTimer ? 'Yes' : 'No'}
               </Badge>
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
         {
            accessorKey: 'userRole',
            header: 'Role',
            cell: ({ row }) => <Role role={row.original.userRole} />,
         },
         {
            accessorKey: 'createdAt',
            header: '',
            cell: ({ row }) => (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="outline"
                        className="capitalize ml-auto border border-gray-200 rounded-2xl h-14 px-4 max-w-sm focus:outline-hidden placeholder:text-[1rem] font-medium"
                     >
                        <EllipsisVertical />
                     </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="shadow bg-white border-border mt-3 rounded-sm w-full">
                     <DropdownMenuItem onClick={() => setSelectedUserToView(row.original)} className="capitalize p-3">
                        View Member Details
                     </DropdownMenuItem>

                     <DropdownMenuItem onClick={() => setSelectedUserToUpdate(row.original)} className="capitalize p-3">
                        Update Member Details
                     </DropdownMenuItem>

                     <Conditional visible={auth ? auth.admin.userRole === UserRole.Pastor : false}>
                        <Conditional visible={!row.original.isAdmin}>
                           <DropdownMenuItem onClick={() => mutation.mutate(row.original._id)} className="capitalize p-3">
                              <Conditional visible={!mutation.isPending}>Onboard to Platform</Conditional>

                              <Conditional visible={mutation.isPending}>
                                 <div className="animate-spin">
                                    <FaSpinner />
                                 </div>

                                 <span>Onboarding {row.original.firstName}...</span>
                              </Conditional>
                           </DropdownMenuItem>
                        </Conditional>

                        <DropdownMenuItem onClick={() => setSelectedUserRole(row.original)} className="capitalize p-3">
                           Update Member Role
                        </DropdownMenuItem>
                     </Conditional>
                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ];

      return columns;
   }, [auth, mutation]);

   const prayerCell = useMemo(() => {
      const match = prayerCells.data.data.find((cell) => cell._id === userQuery.prayerCell);
      return match ? { label: match.name, value: match._id } : undefined;
   }, [prayerCells, userQuery.prayerCell]);

   const department = useMemo(() => {
      const match = departments.data.data.find((cell) => cell._id === userQuery.department);
      return match ? { label: match.name, value: match._id } : undefined;
   }, [departments, userQuery.department]);

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <>
         <Header title="Members" onSearch={(search) => onSetUser({ search })} />

         <Modal onClose={() => setAddUserVisible(false)} title="Add Member" visible={isAddUserVisible}>
            <AddUserForm onAddUser={handleMemberAddition} />
         </Modal>

         <Modal onClose={() => setSendMessageVisible(false)} title="Send General Message" visible={isSendMessageVisible}>
            <SendMessageForm onSuccess={() => setSendMessageVisible(false)} />
         </Modal>

         {selectedUserToUpdate && (
            <Modal onClose={() => setSelectedUserToUpdate(null)} title="Update Member Details" visible>
               <UpdateUserForm user={selectedUserToUpdate} onUpdateUser={handleMemberAddition} />
            </Modal>
         )}

         {selectedUserRole && (
            <Modal onClose={() => setSelectedUserRole(null)} title="Update Member Role" visible>
               <UpdateUserRoleForm userId={selectedUserRole._id} onUpdateRole={handleMemberAddition} />
            </Modal>
         )}

         {selectedUserToView && (
            <Modal onClose={() => setSelectedUserToView(null)} title="Member Details" visible>
               <div className="grid grid-cols-2 gap-4">
                  <Summary
                     title="Personal Information"
                     labels={[
                        {
                           key: 'First Name',
                           value: selectedUserToView.firstName,
                        },
                        {
                           key: 'Last Name',
                           value: selectedUserToView.lastName,
                        },
                        {
                           key: 'Gender',
                           value: selectedUserToView.gender,
                        },
                     ]}
                  />

                  <Summary
                     title="Contact Information"
                     labels={[
                        {
                           key: 'Home Address',
                           value: selectedUserToView.address,
                        },
                        {
                           key: 'Email Address',
                           value: selectedUserToView.email,
                        },
                        {
                           key: 'Phone Number',
                           value: selectedUserToView.phoneNumber,
                        },
                     ]}
                  />

                  <Summary
                     title="Additional Information"
                     labels={[
                        {
                           key: 'Marital Status',
                           value: selectedUserToView.maritalStatus,
                        },
                        {
                           key: 'Birthday',
                           value: formatDate(selectedUserToView.dateOfBirth, 'PPP'),
                        },
                        {
                           key: 'Notes',
                           value: selectedUserToView.notes,
                        },
                     ]}
                  />

                  <Summary
                     title="Workforce Information"
                     labels={[
                        {
                           key: 'Role',
                           value: selectedUserToView.userRole,
                        },
                        {
                           key: 'Prayer Cell',
                           value: selectedUserToView.prayerCell ? selectedUserToView.prayerCell.name : 'None',
                        },
                        {
                           key: 'Department',
                           value: selectedUserToView.department ? selectedUserToView.department.name : 'None',
                        },
                     ]}
                  />
               </div>
            </Modal>
         )}

         <div className="p-6 border-b-border border-b flex items-center justify-between">
            <div className="">
               <div className="text-base text-black font-semibold">Members Chart</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">Track the activities of your members</div>
            </div>

            <div className="flex gap-x-4">
               <Button
                  onClick={() => setSendMessageVisible(true)}
                  variant="ghost"
                  className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <SendIcon />
                  <span className="flex-1">Send General Message</span>
               </Button>

               <Button
                  onClick={() => setAddUserVisible(true)}
                  variant="ghost"
                  className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <PlusIcon />
                  <span className="flex-1">Add New</span>
               </Button>

               <Button
                  onClick={handleExtractedDataExport}
                  variant="ghost"
                  className="bg-green-800 data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <DownloadCloudIcon />

                  <span className="flex-1">Export to spreadsheet</span>
               </Button>
            </div>
         </div>

         <div className="p-6 border-b-border border-b flex items-center justify-between gap-x-6">
            <Select onValueChange={(userRole) => onSetUser({ userRole })} defaultValue={userQuery.userRole}>
               <SelectTrigger style={{ height: '3.5rem' }} className="capitalize rounded-xl border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by role" />
               </SelectTrigger>

               <SelectContent>
                  {Object.values(UserRole).map((role) => (
                     <SelectItem className="capitalize" key={role} value={role}>
                        {role}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Select onValueChange={(workforce) => onSetUser({ workforce })} defaultValue={userQuery.workforce}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by workforce" />
               </SelectTrigger>

               <SelectContent>
                  {OPTIONS.map((option) => (
                     <SelectItem key={option.id} value={option.id}>
                        {option.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Select onValueChange={(gender) => onSetUser({ gender })} defaultValue={userQuery.gender}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by gender" />
               </SelectTrigger>

               <SelectContent>
                  {GENDERS.map((gender) => (
                     <SelectItem key={gender.id} value={gender.id}>
                        {gender.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Select onValueChange={(maritalStatus) => onSetUser({ maritalStatus })} defaultValue={userQuery.maritalStatus}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by marital status" />
               </SelectTrigger>

               <SelectContent>
                  {MARITAL_STATUS.map((maritalStatus) => (
                     <SelectItem key={maritalStatus.id} value={maritalStatus.id}>
                        {maritalStatus.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <SearchableSelect
               isTriggered={isFetchingPrayerCells}
               onTriggerSearch={(name: string) => onSetPrayerCell({ name })}
               data={prayerCells.data.data.map((cell) => ({ label: cell.name, value: cell._id }))}
               value={prayerCell}
               onValueChange={(value) => onSetUser({ prayerCell: value ? value.value : '' })}
               placeholder="Filter by Prayer Cell"
            />

            <SearchableSelect
               isTriggered={isFetchingDepartments}
               onTriggerSearch={(name: string) => onSetDepartment({ name })}
               data={departments.data.data.map((department) => ({ label: department.name, value: department._id }))}
               value={department}
               onValueChange={(value) => onSetUser({ department: value ? value.value : '' })}
               placeholder="Filter by Department"
            />
         </div>

         <DataTable
            filtering={false}
            onSizeChange={(size) => onSetUser({ pageSize: size })}
            onPageChange={(page) => onSetUser({ pageNumber: page })}
            pagination={data.data.pagination}
            loading={isFetching}
            columns={columns}
            data={data.data.data}
         />
      </>
   );
};

export default UsersPage;
