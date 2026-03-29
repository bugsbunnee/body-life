import React, { useEffect, useMemo, useState } from 'react';

import { formatDate } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon } from 'lucide-react';

import { DataTable } from '@/components/ui/datatable';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { exportToExcel } from '@/lib/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { WeeklyReview } from '@/utils/entities';

import { RangeDatePicker } from '@/components/ui/datepicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AddWeeklyReviewForm from '@/components/forms/weekly-review/add-weekly-review-form';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import SearchableSelect from '@/components/common/searchable-select';
import Summary from '@/components/common/summary';

import useDepartments from '@/hooks/useDepartments';
import useQueryStore from '@/store/query';
import useWeeklyReview from '@/hooks/useWeeklyReview';
import useServiceReports from '@/hooks/useServiceReports';

const WeeklyReviewPage: React.FC = () => {
   const { data: departments, isFetching: isFetchingDepartments } = useDepartments();
   const { data: serviceReports } = useServiceReports();
   const { data, isFetching, refetch } = useWeeklyReview();
   const { weeklyReviewQuery, resetQuery, onSetDepartment, onSetWeeklyReview } = useQueryStore();

   const [isAddReview, setIsAddReview] = useState<boolean>(false);
   const [selectedReview, setSelectedReview] = useState<WeeklyReview | null>(null);

   const columns = useMemo(() => {
      const columns: ColumnDef<WeeklyReview>[] = [
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
            accessorKey: 'serviceDate',
            header: 'Service Date',
            cell: ({ row }) => formatDate(new Date(row.original.serviceReport.serviceDate), 'PPP'),
         },
         {
            accessorKey: 'department.name',
            header: 'Department',
            cell: ({ row }) => (
               <Button onClick={() => setSelectedReview(row.original)} className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer">
                  {row.original.department.name}
               </Button>
            ),
         },
         {
            accessorKey: 'submittedBy',
            header: 'Submitted By',
            cell: ({ row }) => row.original.submittedBy.firstName + ' ' + row.original.submittedBy.lastName,
         },
         {
            accessorKey: 'submittedAt',
            header: 'Date Submitted',
            cell: ({ row }) => formatDate(new Date(row.original.submittedAt), 'PPP'),
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
                     <DropdownMenuItem onClick={() => setSelectedReview(row.original)} className="capitalize p-3">
                        View Review Details
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ];

      return columns;
   }, []);

   const handleAddWeeklyReview = () => {
      setIsAddReview(false);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.data.map((datum) => ({
         department: datum.department.name,
         serviceDate: formatDate(datum.serviceReport.serviceDate, 'PPP'),
         submittedAt: formatDate(datum.submittedAt, 'PPP'),
         submittedBy: datum.submittedBy.firstName + ' ' + datum.submittedBy.lastName,
         feedback: datum.feedback ?? 'N/A',
         formatDate: datum.feedbackDueForActionAt ? formatDate(datum.feedbackDueForActionAt, 'PPP') : 'N/A',
      }));

      exportToExcel(extractedData, `WeeklyReviews_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   const department = useMemo(() => {
      const match = departments.data.data.find((cell) => cell._id === weeklyReviewQuery.department);
      return match ? { label: match.name, value: match._id } : undefined;
   }, [departments, weeklyReviewQuery.department]);

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <React.Fragment>
         <Header title="Weekly Reports" onSearch={(search) => onSetWeeklyReview({ search })} />

         <Modal onClose={() => setIsAddReview(false)} title="Add Weekly Report" visible={isAddReview}>
            <AddWeeklyReviewForm onAddWeeklyReport={handleAddWeeklyReview} />
         </Modal>

         {selectedReview && (
            <Modal onClose={() => setSelectedReview(null)} title={'Weekly Report Details for ' + selectedReview.department.name} visible>
               <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2">
                  <Summary
                     title="General Information"
                     labels={[
                        {
                           key: 'Service Date',
                           value: formatDate(selectedReview.serviceReport.serviceDate, 'PPP'),
                        },
                        {
                           key: 'Department',
                           value: selectedReview.department.name,
                        },
                        {
                           key: 'Date Submitted',
                           value: formatDate(selectedReview.submittedAt, 'PPP'),
                        },
                        {
                           key: 'Submitted By',
                           value: selectedReview.submittedBy.firstName + ' ' + selectedReview.submittedBy.lastName,
                        },
                     ]}
                  />

                  <Summary
                     title="Feedback"
                     labels={[
                        {
                           key: 'Feedback',
                           value: selectedReview.feedback ?? 'No feedback yet.',
                        },
                        {
                           key: 'Feedback Due At',
                           value: selectedReview.feedbackDueForActionAt ? formatDate(selectedReview.feedbackDueForActionAt, 'PPP') : 'Not Available',
                        },
                     ]}
                  />
               </div>

               <Summary
                  title="Report"
                  labels={selectedReview.fields.map((field) => ({
                     key: field.label,
                     value: field.value,
                  }))}
               />
            </Modal>
         )}

         <div className="p-4 md:p-6 border-b-border border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <div className="text-base text-black font-semibold">Here are the weekly reports</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">View key insights about weekly reports here</div>
            </div>

            <div className="flex flex-wrap gap-3">
               <RangeDatePicker
                  dateRange={{ from: weeklyReviewQuery.startDate, to: weeklyReviewQuery.endDate }}
                  onSelectRange={(range) => onSetWeeklyReview({ startDate: range.from!, endDate: range.to! })}
               />

               <Button
                  onClick={() => setIsAddReview(true)}
                  variant="ghost"
                  className="bg-main px-5 md:px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <PlusIcon />
                  <span className="flex-1">Add Weekly Report</span>
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

         <div className="p-4 md:p-6 border-b-border border-b grid grid-cols-1 gap-3 sm:grid-cols-2">
            <SearchableSelect
               isTriggered={isFetchingDepartments}
               onTriggerSearch={(name: string) => onSetDepartment({ name })}
               data={departments.data.data.map((department) => ({ label: department.name, value: department._id }))}
               value={department}
               onValueChange={(value) => onSetWeeklyReview({ department: value ? value.value : '' })}
               placeholder="Filter by Department"
            />

            <Select onValueChange={(service) => onSetWeeklyReview({ serviceReport: service })} defaultValue={weeklyReviewQuery.serviceReport}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by Service" />
               </SelectTrigger>

               <SelectContent>
                  {serviceReports.data.map((report) => (
                     <SelectItem key={report._id} value={report._id}>
                        {formatDate(report.serviceDate, 'PPP')}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="border-r border-r-border">
            <DataTable
               filtering={false}
               onSizeChange={(size) => onSetWeeklyReview({ pageSize: size })}
               onPageChange={(page) => onSetWeeklyReview({ pageNumber: page })}
               pagination={data.data.pagination}
               loading={isFetching}
               columns={columns}
               data={data.data.data}
            />
         </div>
      </React.Fragment>
   );
};

export default WeeklyReviewPage;
