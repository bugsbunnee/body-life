import React, { useEffect, useMemo, useState } from 'react';

import { formatDate } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon } from 'lucide-react';

import { DataTable } from '@/components/ui/datatable';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MEETING_DAYS, MEETING_TIMES } from '@/utils/constants';
import { exportToExcel } from '@/lib/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { PrayerCell } from '@/utils/entities';

import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import Summary from '@/components/common/summary';

import useQueryStore from '@/store/query';
import usePrayerCells from '@/hooks/usePrayerCells';
import useUsers from '@/hooks/useUsers';
import AddPrayerCellForm from '@/components/forms/prayer-cell/add-prayer-cell-form';

const PrayerCellsPage: React.FC = () => {
   const { data: users } = useUsers();
   const { data, isFetching, refetch } = usePrayerCells();
   const { prayerCellQuery, resetQuery, onSetPrayerCell, onSetPageNumber } = useQueryStore();

   const [isAddPrayerCell, setIsAddPrayerCell] = useState<boolean>(false);
   const [selectedPrayerCell, setSelectedPrayerCell] = useState<PrayerCell | null>(null);

   const columns = useMemo(() => {
      const columns: ColumnDef<PrayerCell>[] = [
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
            accessorKey: 'leader',
            header: 'Leader',
            cell: ({ row }) => (
               <Button
                  onClick={() => setSelectedPrayerCell(row.original)}
                  className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
               >
                  {row.original.leader.firstName} {row.original.leader.lastName}
               </Button>
            ),
         },
         {
            accessorKey: 'name',
            header: 'Prayer Cell Name',
         },
         {
            accessorKey: 'address',
            header: 'Address',
         },
         {
            accessorKey: 'meetingDay',
            header: 'Meeting Day',
         },
         {
            accessorKey: 'meetingTime',
            header: 'Meeting Time',
         },
         {
            accessorKey: 'totalMembership',
            header: 'Total Membership',
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
                     <DropdownMenuItem onClick={() => setSelectedPrayerCell(row.original)} className="capitalize p-3">
                        View Prayer Cell Details
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ];

      return columns;
   }, []);

   const handleAddPrayerCell = () => {
      setIsAddPrayerCell(false);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.data.map((datum) => ({
         leader: datum.leader.firstName + ' ' + datum.leader.lastName,
         name: datum.name,
         address: datum.address,
         meetingDay: datum.meetingDay,
         meetingTime: datum.meetingTime,
         totalMembership: datum.totalMembership,
      }));

      exportToExcel(extractedData, `PrayerCells_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <React.Fragment>
         <Header title="Prayer Cells" onSearch={(name) => onSetPrayerCell({ name })} />

         <Modal onClose={() => setIsAddPrayerCell(false)} title="Add Prayer Cell" visible={isAddPrayerCell}>
            <AddPrayerCellForm onAddPrayerCell={handleAddPrayerCell} />
         </Modal>

         {selectedPrayerCell && (
            <Modal onClose={() => setSelectedPrayerCell(null)} title="Prayer Cell Details" visible>
               <div className="grid grid-cols-2 gap-4">
                  <Summary
                     title="General Information"
                     labels={[
                        {
                           key: 'Prayer Cell Name',
                           value: selectedPrayerCell.name,
                        },
                        {
                           key: 'Prayer Cell Address',
                           value: selectedPrayerCell.address,
                        },
                        {
                           key: 'Meeting Day',
                           value: selectedPrayerCell.meetingDay + ' at ' + selectedPrayerCell.meetingTime,
                        },
                     ]}
                  />

                  <Summary
                     title="More Details"
                     labels={[
                        {
                           key: 'Prayer Cell Leader',
                           value: selectedPrayerCell.leader.firstName + ' ' + selectedPrayerCell.leader.lastName,
                        },
                        {
                           key: 'Total Membership',
                           value: selectedPrayerCell.totalMembership.toString() + ' members',
                        },
                     ]}
                  />
               </div>
            </Modal>
         )}

         <div className="p-6 border-b-border border-b flex items-center justify-between">
            <div className="">
               <div className="text-base text-black font-semibold">Here are the prayer cells</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">View key insights about prayer cells here</div>
            </div>

            <div className="flex gap-x-4">
               <Button
                  onClick={() => setIsAddPrayerCell(true)}
                  variant="ghost"
                  className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <PlusIcon />
                  <span className="flex-1">Add Prayer Cell</span>
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

         <div className="p-6 border-b-border border-b gap-x-8 flex items-center justify-between">
            <Select onValueChange={(meetingDay) => onSetPrayerCell({ meetingDay })} defaultValue={prayerCellQuery.meetingDay}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by Meeting Day" />
               </SelectTrigger>

               <SelectContent>
                  {MEETING_DAYS.map((day) => (
                     <SelectItem key={day.id} value={day.id}>
                        {day.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Select onValueChange={(meetingTime) => onSetPrayerCell({ meetingTime })} defaultValue={prayerCellQuery.meetingTime}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by Meeting Time" />
               </SelectTrigger>

               <SelectContent>
                  {MEETING_TIMES.map((time) => (
                     <SelectItem key={time.id} value={time.id}>
                        {time.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Select onValueChange={(leader) => onSetPrayerCell({ leader })} defaultValue={prayerCellQuery.leader}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by Leader" />
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

         <div className="border-r border-r-border">
            <DataTable filtering={false} onPageChange={onSetPageNumber} pagination={data.data.pagination} loading={isFetching} columns={columns} data={data.data.data} />
         </div>
      </React.Fragment>
   );
};

export default PrayerCellsPage;
