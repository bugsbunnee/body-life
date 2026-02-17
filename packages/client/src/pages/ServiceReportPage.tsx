import type React from 'react';

import { useEffect, useMemo, useState } from 'react';
import { DownloadCloudIcon, PlusIcon } from 'lucide-react';
import { formatDate } from 'date-fns';
import { exportToExcel, formatAmount } from '@/lib/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { ServiceReport } from '@/utils/entities';

import { Button } from '@/components/ui/button';
import { RangeDatePicker } from '@/components/ui/datepicker';
import { DataTable } from '@/components/ui/datatable';
import { Checkbox } from '@/components/ui/checkbox';

import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import AddServiceReportForm from '@/components/forms/service-report/add-service-report-form';
import Summary from '@/components/common/summary';

import useQueryStore from '@/store/query';
import useServiceReports from '@/hooks/useServiceReports';

const ServiceReportPage: React.FC = () => {
   const [isAddReportVisible, setAddReportVisible] = useState(false);
   const [selectedReport, setSelectedReport] = useState<ServiceReport | null>(null);

   const { isFetching, data, refetch } = useServiceReports();
   const { dateRangeQuery, onSetDateRange, onSetSearch, onSetPageNumber, resetQuery } = useQueryStore();

   const handleReportAddition = () => {
      setAddReportVisible(false);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.map((datum) => ({
         prepPrayersBy: datum.prepPrayers.firstName + ' ' + datum.prepPrayers.lastName,
         worshipBy: datum.worship.firstName + ' ' + datum.worship.lastName,
         sermonBy: datum.message.preacher.firstName + ' ' + datum.message.preacher.lastName,
         seatArrangementCount: datum.seatArrangementCount,
         firstTimerCount: datum.firstTimerCount,
         offering: formatAmount(datum.offering),
         totalAttendance: datum.totalAttendance,
      }));

      exportToExcel(extractedData, `ServiceReports_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   const columns = useMemo(() => {
      const columns: ColumnDef<ServiceReport>[] = [
         {
            accessorKey: 'serviceDate',
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
            accessorKey: 'prepPrayers',
            header: 'Prep. Prayers By',
            cell: ({ row }) => (
               <Button onClick={() => setSelectedReport(row.original)} className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer">
                  {row.original.prepPrayers.firstName} {row.original.prepPrayers.lastName}
               </Button>
            ),
         },
         {
            accessorKey: 'worship',
            header: 'Worship By',
            cell: ({ row }) => (
               <span>
                  {row.original.worship.firstName} {row.original.worship.lastName}
               </span>
            ),
         },
         {
            accessorKey: 'message',
            header: 'Sermon By',
            cell: ({ row }) => (
               <span>
                  {row.original.message.preacher.firstName} {row.original.message.preacher.lastName}
               </span>
            ),
         },
         {
            accessorKey: 'seatArrangementCount',
            header: 'Total Seat Arrangment',
            cell: ({ row }) => <span>{row.original.seatArrangementCount} seats</span>,
         },
         {
            accessorKey: 'firstTimerCount',
            header: 'Total First Timers',
            cell: ({ row }) => <span>{row.original.firstTimerCount} person(s)</span>,
         },
         {
            accessorKey: 'offering',
            header: 'Offering',
            cell: ({ row }) => <span>{formatAmount(row.original.offering)}</span>,
         },
         {
            accessorKey: 'totalAttendance',
            header: 'Total Attendance',
         },
      ];

      return columns;
   }, []);

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <>
         <Header title="Service Report" onSearch={onSetSearch} />

         <Modal onClose={() => setAddReportVisible(false)} title="Add Service Report" visible={isAddReportVisible}>
            <AddServiceReportForm onAddServiceReport={handleReportAddition} />
         </Modal>

         {selectedReport && (
            <Modal onClose={() => setSelectedReport(null)} title="Service Details" visible>
               <div className="grid grid-cols-2 gap-4">
                  <Summary
                     title="General Information"
                     labels={[
                        {
                           key: 'Service Date',
                           value: formatDate(selectedReport.serviceDate, 'PPP'),
                        },
                        {
                           key: 'Prep. Prayers Led By',
                           value: `${selectedReport.prepPrayers.firstName} ${selectedReport.prepPrayers.lastName}`,
                        },
                        {
                           key: 'Worship Led By',
                           value: `${selectedReport.worship.firstName} ${selectedReport.worship.lastName}`,
                        },
                        {
                           key: 'Sermon Preached By',
                           value: `${selectedReport.message.preacher.firstName} ${selectedReport.message.preacher.lastName}`,
                        },
                     ]}
                  />

                  <Summary
                     title="Others"
                     labels={[
                        {
                           key: 'First Timer Count',
                           value: selectedReport.firstTimerCount.toString(),
                        },
                        {
                           key: 'Total Seat Arrangement',
                           value: selectedReport.seatArrangementCount.toString(),
                        },
                        {
                           key: 'Offering',
                           value: formatAmount(selectedReport.offering),
                        },
                     ]}
                  />

                  {selectedReport.counts.map((count) => (
                     <Summary
                        key={count.time}
                        title={'Count: Round ' + count.round}
                        labels={[
                           { key: 'Time', value: count.time },
                           { key: 'Adults', value: count.adults.toString() },
                           { key: 'Children', value: count.children.toString() },
                           { key: 'Total', value: (count.adults + count.children).toString() },
                        ]}
                     />
                  ))}
               </div>
            </Modal>
         )}

         <div className="p-6 border-b-border border-b flex items-center justify-between">
            <div className="">
               <div className="text-base text-black font-semibold">Measure attendance trends</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">View metrics and benchmarks for service.</div>
            </div>

            <div className="flex gap-x-4">
               <RangeDatePicker
                  dateRange={{ from: dateRangeQuery.startDate, to: dateRangeQuery.endDate }}
                  onSelectRange={(range) => onSetDateRange({ startDate: range.from!, endDate: range.to! })}
               />

               <Button
                  onClick={() => setAddReportVisible(true)}
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

                  <span className="flex-1">Export to Excel</span>
               </Button>
            </div>
         </div>

         <DataTable filtering={false} onPageChange={onSetPageNumber} pagination={data.pagination} loading={isFetching} columns={columns} data={data.data} />
      </>
   );
};

export default ServiceReportPage;
