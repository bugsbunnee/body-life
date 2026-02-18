import type React from 'react';

import { useEffect, useMemo, useState } from 'react';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon } from 'lucide-react';
import { formatDate } from 'date-fns';

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import type { ColumnDef } from '@tanstack/react-table';
import type { IMessage } from '@/utils/entities';

import Header from '@/components/common/header';
import MessageSummary from '@/components/message/message-summary';
import Modal from '@/components/common/modal';
import SendNewsLetter from '@/components/message/send-newsletter';
import Summary from '@/components/common/summary';
import UploadMessageForm from '@/components/forms/message/upload-message-form';

import useMessages from '@/hooks/useMessages';
import useQueryStore from '@/store/query';

import { Button } from '@/components/ui/button';
import { RangeDatePicker } from '@/components/ui/datepicker';
import { DataTable } from '@/components/ui/datatable';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { exportToExcel } from '@/lib/utils';

const MessagesPage: React.FC = () => {
   const [isAddMessageVisible, setAddMessagesVisible] = useState(false);
   const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);

   const { isFetching, data, refetch } = useMessages();
   const { dateRangeQuery, onSetDateRange, onSetSearch, onSetPageNumber, resetQuery } = useQueryStore();

   const handleMessageddition = () => {
      setAddMessagesVisible(false);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.data.map((datum) => ({
         title: datum.title,
         preacher: datum.preacher.firstName + ' ' + datum.preacher.lastName,
         date: formatDate(datum.date, 'PPP'),
         videoUrl: datum.videoUrl,
      }));

      exportToExcel(extractedData, `Messages_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   const columns = useMemo(() => {
      const columns: ColumnDef<IMessage>[] = [
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
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
               <Button
                  onClick={() => setSelectedMessage(row.original)}
                  className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
               >
                  {row.original.title}
               </Button>
            ),
         },
         {
            accessorKey: 'preacher',
            header: 'Preacher',
            cell: ({ row }) => (
               <span className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer">
                  {row.original.preacher.firstName} {row.original.preacher.lastName}
               </span>
            ),
         },
         {
            accessorKey: 'date',
            header: 'Date Preached',
            cell: ({ row }) => <span className="text-main font-semiboldr">{formatDate(row.original.date, 'PPP')}</span>,
         },
         {
            accessorKey: 'videoUrl',
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
                     <DropdownMenuItem className="capitalize p-3">
                        <a href={row.original.videoUrl} rel="noopener noreferrer" target="_blank">
                           View Video
                        </a>
                     </DropdownMenuItem>

                     <DropdownMenuSeparator />

                     <DropdownMenuItem onClick={() => setSelectedMessage(row.original)} className="capitalize p-3">
                        View Summary
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
         <Header title="Messages" onSearch={onSetSearch} />

         <Modal onClose={() => setAddMessagesVisible(false)} title="Upload Message" visible={isAddMessageVisible}>
            <UploadMessageForm onAddMessage={handleMessageddition} />
         </Modal>

         {selectedMessage && (
            <Modal onClose={() => setSelectedMessage(null)} title="Message Details" visible>
               <div className="gap-4">
                  {selectedMessage.summary && (
                     <div className="mb-4 flex justify-end items-center">
                        <SendNewsLetter message={selectedMessage} />
                     </div>
                  )}

                  <Summary
                     title="General Information"
                     labels={[
                        {
                           key: 'Title',
                           value: selectedMessage.title,
                        },
                        {
                           key: 'Preacher',
                           value: selectedMessage.preacher.firstName + ' ' + selectedMessage.preacher.lastName,
                        },
                        {
                           key: 'Date Preached',
                           value: formatDate(selectedMessage.date, 'PPP'),
                        },
                     ]}
                  />

                  <div className="mt-4">
                     <MessageSummary message={selectedMessage} />
                  </div>
               </div>
            </Modal>
         )}

         <div className="p-6 border-b-border border-b flex items-center justify-between">
            <div className="">
               <div className="text-base text-black font-semibold">View All Messages</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">Track the messages preached at RCNLagos Island Church</div>
            </div>

            <div className="flex gap-x-4">
               <RangeDatePicker
                  dateRange={{ from: dateRangeQuery.startDate, to: dateRangeQuery.endDate }}
                  onSelectRange={(range) => onSetDateRange({ startDate: range.from!, endDate: range.to! })}
               />

               <Button
                  onClick={() => setAddMessagesVisible(true)}
                  variant="ghost"
                  className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <PlusIcon />
                  <span className="flex-1">Upload Message</span>
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

         <DataTable onPageChange={onSetPageNumber} pagination={data.data.pagination} loading={isFetching} columns={columns} data={data.data.data} />
      </>
   );
};

export default MessagesPage;
