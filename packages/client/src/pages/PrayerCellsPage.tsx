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

import AddPrayerCellForm from '@/components/forms/prayer-cell/add-prayer-cell-form';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import SearchableSelect from '@/components/common/searchable-select';
import Summary from '@/components/common/summary';

import useQueryStore from '@/store/query';
import usePrayerCells from '@/hooks/usePrayerCells';
import useUsers from '@/hooks/useUsers';

const PrayerCellsPage: React.FC = () => {
   const { data: users, isFetching: isFetchingUsers } = useUsers();
   const { data, isFetching, refetch } = usePrayerCells();
   const { prayerCellQuery, resetQuery, onSetUser, onSetPrayerCell } = useQueryStore();

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
                        className="ml-auto border-0 rounded-full h-8 w-8 p-0 md:border md:border-gray-200 md:rounded-2xl md:h-14 md:w-auto md:px-4 focus:outline-hidden font-medium"
                     >
                        <EllipsisVertical className="size-5" />
                     </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="shadow bg-white border-border mt-3 rounded-xl w-full">
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

   const user = useMemo(() => {
      const match = users.data.data.find((cell) => cell._id === prayerCellQuery.leader);
      return match ? { label: match.firstName + ' ' + match.lastName, value: match._id } : undefined;
   }, [users, prayerCellQuery.leader]);

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
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

         <div className="p-4 md:p-6 border-b-border border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="">
               <div className="text-base text-black font-semibold">Here are the prayer cells</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">View key insights about prayer cells here</div>
            </div>

            <div className="flex flex-wrap gap-3">
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

         <div className="p-4 md:p-6 border-b-border border-b grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select onValueChange={(meetingDay) => onSetPrayerCell({ meetingDay })} defaultValue={prayerCellQuery.meetingDay}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
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
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
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

            <SearchableSelect
               isTriggered={isFetchingUsers}
               onTriggerSearch={(search: string) => onSetUser({ search })}
               data={users.data.data.map((cell) => ({ label: cell.firstName + ' ' + cell.lastName, value: cell._id }))}
               value={user}
               onValueChange={(value) => onSetPrayerCell({ leader: value ? value.value : '' })}
               placeholder="Filter by Prayer Cell"
            />
         </div>

         <div className="border-r border-r-border">
            <DataTable
               onSizeChange={(size) => onSetPrayerCell({ pageSize: size })}
               onPageChange={(page) => onSetPrayerCell({ pageNumber: page })}
               filtering={false}
               pagination={data.data.pagination}
               loading={isFetching}
               columns={columns}
               data={data.data.data}
            />
         </div>
      </React.Fragment>
   );
};

export default PrayerCellsPage;
