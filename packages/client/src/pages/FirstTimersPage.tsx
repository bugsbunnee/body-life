import React, { useEffect, useMemo, useState } from 'react';

import { formatDate } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DownloadCloudIcon, EllipsisVertical } from 'lucide-react';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';

import { RangeDatePicker } from '@/components/ui/datepicker';
import { DataTable } from '@/components/ui/datatable';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONTACT_METHODS, FOLLOW_UP_STATUS } from '@/utils/constants';
import { exportToExcel } from '@/lib/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { FirstTimer } from '@/utils/entities';

import Conditional from '@/components/common/conditional';
import Header from '@/components/common/header';
import FirstTimerMetrics from '@/components/layout/first-timers/first-timer-metrics';
import Modal from '@/components/common/modal';
import Summary from '@/components/common/summary';
import UpdateFollowUpForm from '@/components/forms/first-timer/update-follow-up';

import useFirstTimers from '@/hooks/useFirstTimers';
import useQueryStore from '@/store/query';
import useUsers from '@/hooks/useUsers';

const FirstTimersPage: React.FC = () => {
   const { data: users } = useUsers();
   const { data, isFetching, refetch } = useFirstTimers();
   const { firstTimerQuery, resetQuery, onSetFirstTimer, onSetSearch } = useQueryStore();

   const [selectedDataToView, setSelectedDataToView] = useState<FirstTimer | null>(null);
   const [selectedDataToUpdate, setSelectedDataToUpdate] = useState<FirstTimer | null>(null);

   const columns = useMemo(() => {
      const columns: ColumnDef<FirstTimer>[] = [
         {
            accessorKey: '_id',
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
            accessorKey: 'serviceAttended',
            header: 'Date Joined',
            cell: ({ row }) => <span>{formatDate(row.original.serviceAttended.serviceDate, 'PPP')}</span>,
         },
         {
            accessorKey: 'user',
            header: 'Full Name',
            cell: ({ row }) => (
               <Button
                  onClick={() => setSelectedDataToView(row.original)}
                  className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
               >
                  {row.original.user.firstName} {row.original.user.lastName}
               </Button>
            ),
         },
         {
            accessorKey: 'assignedTo',
            header: 'Assigned To',
            cell: ({ row }) => (
               <span>
                  {row.original.assignedTo.firstName} {row.original.assignedTo.lastName}
               </span>
            ),
         },
         {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => <Badge>{row.original.status}</Badge>,
         },
         {
            accessorKey: 'wantsToJoinDepartment',
            header: 'Wants to Join Department',
            cell: ({ row }) => <Badge className={row.original.wantsToJoinDepartment ? 'bg-green-400' : 'bg-red-400'}>{row.original.wantsToJoinDepartment ? 'Yes' : 'No'}</Badge>,
         },
         {
            accessorKey: 'feedback',
            header: 'Feedback',
         },
         {
            accessorKey: 'preferredContactMethod',
            header: 'Options',
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
                     <DropdownMenuItem onClick={() => setSelectedDataToView(row.original)} className="capitalize p-3">
                        View First Timer Details
                     </DropdownMenuItem>

                     <DropdownMenuSeparator />

                     <DropdownMenuItem onClick={() => setSelectedDataToUpdate(row.original)} className="capitalize p-3">
                        Provide Update on First Timer
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ];

      return columns;
   }, []);

   const handleFirstTimerUpdate = () => {
      setSelectedDataToUpdate(null);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.map((datum) => ({
         user: datum.user.firstName + ' ' + datum.user.lastName,
         dateJoined: formatDate(datum.serviceAttended.serviceDate, 'PPP'),
         feedback: datum.feedback,
         preferredContactMethod: datum.preferredContactMethod,
         assignedTo: datum.assignedTo.firstName + ' ' + datum.assignedTo.lastName,
         status: datum.status,
         wantsToJoinDepartment: datum.wantsToJoinDepartment ? 'Yes' : 'No',
      }));

      exportToExcel(extractedData, `FirstTimers_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <React.Fragment>
         <Header title="First Timers" onSearch={onSetSearch} />

         {selectedDataToUpdate && (
            <Modal onClose={() => setSelectedDataToUpdate(null)} title="Provide First Timer Feedback" visible>
               <UpdateFollowUpForm firstTimerId={selectedDataToUpdate._id} onUpdateFirstTimer={handleFirstTimerUpdate} />
            </Modal>
         )}

         {selectedDataToView && (
            <Modal onClose={() => setSelectedDataToView(null)} title="First Timer Details" visible>
               <div className="grid grid-cols-2 gap-4">
                  <Summary
                     title="General Information"
                     labels={[
                        {
                           key: 'Date Joined',
                           value: formatDate(selectedDataToView.serviceAttended.serviceDate, 'PPP'),
                        },
                        {
                           key: 'Full Name',
                           value: selectedDataToView.user.firstName + ' ' + selectedDataToView.user.lastName,
                        },
                        {
                           key: 'Feedback',
                           value: selectedDataToView.feedback,
                        },
                        {
                           key: 'Preferred Contact Method',
                           value: selectedDataToView.preferredContactMethod,
                        },
                     ]}
                  />

                  <Summary
                     title="Follow-Up Contact"
                     labels={[
                        {
                           key: 'Assigned To',
                           value: selectedDataToView.assignedTo.firstName + ' ' + selectedDataToView.assignedTo.lastName,
                        },
                        {
                           key: 'Next Action Due Date',
                           value: formatDate(selectedDataToView.nextActionAt, 'PPP'),
                        },
                        {
                           key: 'Status',
                           value: selectedDataToView.status,
                        },
                        {
                           key: 'Wants to Join Department',
                           value: selectedDataToView.wantsToJoinDepartment ? 'Yes' : 'No',
                        },
                     ]}
                  />

                  <Conditional visible={selectedDataToView.attempts.length > 0}>
                     {selectedDataToView.attempts.map((attempt) => (
                        <Summary
                           key={attempt._id}
                           title="Follow-Up Attempt"
                           labels={[
                              {
                                 key: 'Contacted By',
                                 value: attempt.contactedBy.firstName + ' ' + attempt.contactedBy.lastName,
                              },
                              {
                                 key: 'Contacted Date',
                                 value: formatDate(attempt.contactedAt, 'PPP'),
                              },
                              {
                                 key: 'Contact Method',
                                 value: attempt.channel,
                              },
                              {
                                 key: 'Response',
                                 value: attempt.response,
                              },
                              {
                                 key: 'Attempt Successful',
                                 value: attempt.successful ? 'Yes' : 'No',
                              },
                           ]}
                        />
                     ))}
                  </Conditional>
               </div>
            </Modal>
         )}

         <div className="p-6 border-b-border border-b flex items-center justify-between">
            <div className="">
               <div className="text-base text-black font-semibold">Here are the first timers</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">View key insights about first timers here</div>
            </div>

            <div className="flex gap-x-4">
               <RangeDatePicker
                  dateRange={{ from: firstTimerQuery.dateJoinedStart, to: firstTimerQuery.dateJoinedEnd }}
                  onSelectRange={(range) => onSetFirstTimer({ dateJoinedStart: range.from!, dateJoinedEnd: range.to! })}
               />

               <Button
                  onClick={handleExtractedDataExport}
                  variant="ghost"
                  className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <DownloadCloudIcon />

                  <span className="flex-1">Export to spreadsheet</span>
               </Button>
            </div>
         </div>

         <div className="p-6 border-b-border border-b gap-x-8 flex items-center justify-between">
            <Select onValueChange={(status) => onSetFirstTimer({ status })} defaultValue={firstTimerQuery.status}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by Status" />
               </SelectTrigger>

               <SelectContent>
                  {FOLLOW_UP_STATUS.map((status) => (
                     <SelectItem key={status.id} value={status.id}>
                        {status.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Select onValueChange={(preferredContactMethod) => onSetFirstTimer({ preferredContactMethod })} defaultValue={firstTimerQuery.preferredContactMethod}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by Assigned Contact" />
               </SelectTrigger>

               <SelectContent>
                  {CONTACT_METHODS.map((method) => (
                     <SelectItem key={method.id} value={method.id}>
                        {method.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Select onValueChange={(assignedTo) => onSetFirstTimer({ assignedTo })} defaultValue={firstTimerQuery.assignedTo}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by Assigned Contact" />
               </SelectTrigger>

               <SelectContent>
                  {users.data.data.map((user) => (
                     <SelectItem key={user._id} value={user._id}>
                        {user.firstName} {user.lastName}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="grid grid-cols-4 gap-x-6 p-6 border-b-border border-b">
            <FirstTimerMetrics />
         </div>

         <div className="border-r border-r-border">
            <DataTable
               filtering={false}
               onSizeChange={(size) => onSetFirstTimer({ pageSize: size })}
               onPageChange={(page) => onSetFirstTimer({ pageNumber: page })}
               pagination={data.pagination}
               loading={isFetching}
               columns={columns}
               data={data.data}
            />
         </div>
      </React.Fragment>
   );
};

export default FirstTimersPage;
