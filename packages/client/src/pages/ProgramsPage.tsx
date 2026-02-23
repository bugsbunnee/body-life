import type React from 'react';

import { useEffect, useMemo, useState } from 'react';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon } from 'lucide-react';
import { formatDate } from 'date-fns';
import { cn, exportToExcel, summarize } from '@/lib/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { Program } from '@/utils/entities';

import AddProgramForm from '@/components/forms/program/add-program-form';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import Summary from '@/components/common/summary';

import usePrograms from '@/hooks/usePrograms';
import useQueryStore from '@/store/query';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/datatable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RangeDatePicker } from '@/components/ui/datepicker';
import { useMutation } from '@tanstack/react-query';
import http from '@/services/http.service';
import Conditional from '@/components/common/conditional';
import { FaSpinner } from 'react-icons/fa';

const ProgramsPage: React.FC = () => {
   const [isAddProgramVisible, setAddProgramVisible] = useState(false);
   const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

   const { isFetching, data, refetch } = usePrograms();
   const { programQuery, onSetProgram, resetQuery } = useQueryStore();

   const mutation = useMutation({
      mutationFn: (id: string) => http.delete('/api/program/' + id),
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
                     'bg-orange-50 text-orange-600': !row.original.isUpcoming,
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
                        className="capitalize ml-auto border border-gray-200 rounded-2xl h-14 px-4 max-w-sm focus:outline-hidden placeholder:text-[1rem] font-medium"
                     >
                        <EllipsisVertical />
                     </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="shadow bg-white border-border mt-3 rounded-sm w-full">
                     <DropdownMenuItem onClick={() => setSelectedProgram(row.original)} className="capitalize p-3">
                        View Member Details
                     </DropdownMenuItem>

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
   }, []);

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
               <div className="grid grid-cols-2 gap-4">
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

         <div className="p-6 border-b-border border-b flex items-center justify-between">
            <div className="">
               <div className="text-base text-black font-semibold">Programs</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">Track the programs scheduled for the time period</div>
            </div>

            <div className="flex gap-x-4">
               <RangeDatePicker
                  dateRange={{ from: programQuery.startDate, to: programQuery.endDate }}
                  onSelectRange={(range) => onSetProgram({ startDate: range.from!, endDate: range.to! })}
               />

               <Button
                  onClick={() => setAddProgramVisible(true)}
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

         <Tabs defaultValue="upcoming" className="w-full">
            <div className="p-6 border-b-border border-b w-full flex items-center justify-between">
               <TabsList>
                  <TabsTrigger value="upcoming" onClick={() => onSetProgram({ startDate: new Date() })}>
                     Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="past" onClick={() => onSetProgram({ endDate: new Date() })}>
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
