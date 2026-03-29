import type React from 'react';
import dayjs from 'dayjs';

import { useEffect, useMemo, useState } from 'react';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon } from 'lucide-react';
import { formatDate } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { FaSpinner } from 'react-icons/fa';
import { cn, exportToExcel, getErrorMessage, summarize } from '@/lib/utils';
import { toast } from 'sonner';

import type { ColumnDef } from '@tanstack/react-table';
import type { Program } from '@/utils/entities';

import AddProgramForm from '@/components/forms/program/add-program-form';
import Conditional from '@/components/common/conditional';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import Summary from '@/components/common/summary';

import http from '@/services/http.service';

import usePrograms from '@/hooks/usePrograms';
import useQueryStore from '@/store/query';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/datatable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RangeDatePicker } from '@/components/ui/datepicker';

const ProgramsPage: React.FC = () => {
   const [isAddProgramVisible, setAddProgramVisible] = useState(false);
   const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

   const { isFetching, data, refetch } = usePrograms();
   const { programQuery, onSetProgram, resetQuery } = useQueryStore();

   const mutation = useMutation({
      mutationFn: (id: string) => http.delete('/api/program/' + id),
   });

   const reminder = useMutation({
      mutationFn: (id: string) => http.post('/api/program/' + id + '/reminder'),
      onSuccess: () => toast.success('Reminders have been sent for the program.'),
      onError: (error) => toast.error('Failed to send reminder.', { description: getErrorMessage(error) }),
   });

   const handleProgramAddition = () => {
      setAddProgramVisible(false);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.data.map((datum) => ({
         title: datum.title,
         description: datum.description,
         address: datum.address,
         status: datum.isUpcoming ? 'Upcoming' : 'Past',
         scheduledFor: formatDate(datum.scheduledFor, 'PPP'),
      }));

      exportToExcel(extractedData, `Programs_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   const columns = useMemo(() => {
      const columns: ColumnDef<Program>[] = [
         {
            accessorKey: 'id',
            header: 'Avatar',
            cell: ({ row }) => (
               <Avatar>
                  <AvatarImage src={row.original.imageUrl} />
               </Avatar>
            ),
         },
         {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
               <Button
                  onClick={() => setSelectedProgram(row.original)}
                  className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
               >
                  {row.original.title}
               </Button>
            ),
         },
         {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => summarize(row.original.description, 50),
         },
         {
            accessorKey: 'address',
            header: 'Address',
            cell: ({ row }) => summarize(row.original.address, 50),
         },
         {
            accessorKey: 'isUpcoming',
            header: 'Status',
            cell: ({ row }) => (
               <Badge
                  className={cn({
                     'bg-green-50 text-green-600': row.original.isUpcoming,
                     'bg-orange-50 text-orange-500': !row.original.isUpcoming,
                  })}
               >
                  {row.original.isUpcoming ? 'Upcoming' : 'Past'}
               </Badge>
            ),
         },
         {
            accessorKey: 'scheduledFor',
            header: 'Date',
            cell: ({ row }) => formatDate(row.original.scheduledFor, 'PPP'),
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
                     <DropdownMenuItem onClick={() => setSelectedProgram(row.original)} className="capitalize p-3">
                        View Member Details
                     </DropdownMenuItem>

                     <Conditional visible={row.original.isActive}>
                        <DropdownMenuItem onClick={() => reminder.mutate(row.original._id)} className="capitalize p-3">
                           <Conditional visible={mutation.isPending}>
                              <div className="animate-spin">
                                 <FaSpinner />
                              </div>
                           </Conditional>

                           <Conditional visible={!mutation.isPending}>Send Reminder</Conditional>
                        </DropdownMenuItem>
                     </Conditional>

                     <DropdownMenuItem onClick={() => mutation.mutate(row.original._id)} className="capitalize p-3">
                        <Conditional visible={mutation.isPending}>
                           <div className="animate-spin">
                              <FaSpinner />
                           </div>
                        </Conditional>

                        <Conditional visible={!mutation.isPending}>Deactivate Program</Conditional>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ];

      return columns;
   }, [mutation, reminder]);

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <>
         <Header title="Programs" onSearch={(search) => onSetProgram({ search })} />

         <Modal onClose={() => setAddProgramVisible(false)} title="Add Program" visible={isAddProgramVisible}>
            <AddProgramForm onCreateProgram={handleProgramAddition} />
         </Modal>

         {selectedProgram && (
            <Modal onClose={() => setSelectedProgram(null)} title="Program Details" visible>
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Summary
                     title="General Information"
                     labels={[
                        {
                           key: 'Title',
                           value: selectedProgram.title,
                        },
                        {
                           key: 'Description',
                           value: selectedProgram.description,
                        },
                        {
                           key: 'Venue',
                           value: selectedProgram.address,
                        },
                     ]}
                  />

                  <Summary
                     title="Additional Information"
                     labels={[
                        {
                           key: 'Program Date',
                           value: formatDate(selectedProgram.scheduledFor, 'PPP'),
                        },
                        {
                           key: 'Status',
                           value: selectedProgram.isUpcoming ? 'Upcoming' : 'Past',
                        },
                     ]}
                  />
               </div>
            </Modal>
         )}

         <div className="p-4 md:p-6 border-b-border border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <div className="text-base text-black font-semibold">Programs</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">Track the programs scheduled for the time period</div>
            </div>

            <div className="flex flex-wrap gap-3">
               <RangeDatePicker
                  dateRange={{ from: programQuery.startDate, to: programQuery.endDate }}
                  onSelectRange={(range) => onSetProgram({ startDate: range.from!, endDate: range.to! })}
               />

               <Button
                  onClick={() => setAddProgramVisible(true)}
                  variant="ghost"
                  className="bg-main px-5 md:px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <PlusIcon />
                  <span className="flex-1">Add New</span>
               </Button>

               <Button
                  onClick={handleExtractedDataExport}
                  variant="ghost"
                  className="bg-green-800 px-5 md:px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <DownloadCloudIcon />
                  <span className="flex-1">Export to spreadsheet</span>
               </Button>
            </div>
         </div>

         <Tabs defaultValue="upcoming" className="w-full">
            <div className="p-4 md:p-6 border-b-border border-b">
               <TabsList>
                  <TabsTrigger value="upcoming" onClick={() => onSetProgram({ startDate: dayjs().toDate(), endDate: dayjs().add(90, 'days').toDate() })}>
                     Upcoming
                  </TabsTrigger>

                  <TabsTrigger value="past" onClick={() => onSetProgram({ startDate: dayjs().startOf('year').toDate(), endDate: dayjs().toDate() })}>
                     Past
                  </TabsTrigger>
               </TabsList>
            </div>

            <TabsContent value="upcoming">
               <DataTable
                  filtering={false}
                  onSizeChange={(size) => onSetProgram({ pageSize: size })}
                  onPageChange={(page) => onSetProgram({ pageNumber: page })}
                  pagination={data.data.pagination}
                  loading={isFetching}
                  columns={columns}
                  data={data.data.data}
               />
            </TabsContent>

            <TabsContent value="past">
               <DataTable
                  filtering={false}
                  onSizeChange={(size) => onSetProgram({ pageSize: size })}
                  onPageChange={(page) => onSetProgram({ pageNumber: page })}
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

export default ProgramsPage;
