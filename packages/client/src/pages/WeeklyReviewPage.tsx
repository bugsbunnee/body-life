import React, { useEffect, useMemo, useState } from 'react';

import { formatDate } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon } from 'lucide-react';

import { DataTable } from '@/components/ui/datatable';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn, exportToExcel, getIsRolePermitted } from '@/lib/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { WeeklyReview } from '@/utils/entities';

import { RangeDatePicker } from '@/components/ui/datepicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AddWeeklyReviewFeedbackForm from '@/components/forms/weekly-review/add-weekly-review-feedback-form';
import AddWeeklyReviewForm from '@/components/forms/weekly-review/add-weekly-review-form';
import Conditional from '@/components/common/conditional';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import SearchableSelect from '@/components/common/searchable-select';
import Summary from '@/components/common/summary';

import useAuthStore from '@/store/auth';
import useDepartments from '@/hooks/useDepartments';
import useQueryStore from '@/store/query';
import useWeeklyReview from '@/hooks/useWeeklyReview';
import useWeeklyReviewsByService from '@/hooks/useWeeklyReviewsByService';
import useServiceReports from '@/hooks/useServiceReports';

import { ROLES } from '@/utils/constants';

const WeeklyReviewPage: React.FC = () => {
   const { auth } = useAuthStore();
   const { data: departments, isFetching: isFetchingDepartments } = useDepartments();
   const { data: serviceReports } = useServiceReports();
   const { data, isFetching, refetch } = useWeeklyReview();
   const { weeklyReviewQuery, resetQuery, onSetDepartment, onSetWeeklyReview } = useQueryStore();

   const [isAddReview, setIsAddReview] = useState<boolean>(false);
   const [isWeekFeedbackVisible, setIsWeekFeedbackVisible] = useState<boolean>(false);
   const [selectedReview, setSelectedReview] = useState<WeeklyReview | null>(null);
   const [selectedReviewForFeedback, setSelectedReviewForFeedback] = useState<WeeklyReview | null>(null);

   const weekReviews = useWeeklyReviewsByService(weeklyReviewQuery.serviceReport);

   const { missingDepartments, feedbackByDepartment, feedbackCount } = useMemo(() => {
      const submittedDepartmentIds = new Set(weekReviews.data.data.data.map((review) => review.department._id));

      const feedbackByDepartment = weekReviews.data.data.data
         .filter((review) => (review.feedback ?? []).length > 0)
         .map((review) => ({ departmentId: review.department._id, departmentName: review.department.name, feedback: review.feedback ?? [] }));

      return {
         missingDepartments: departments.data.data.filter((department) => !submittedDepartmentIds.has(department._id)),
         feedbackByDepartment,
         feedbackCount: feedbackByDepartment.reduce((total, department) => total + department.feedback.length, 0),
      };
   }, [weekReviews.data.data.data, departments.data.data]);

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

                     <Conditional visible={auth ? getIsRolePermitted(ROLES.CORE, auth.admin.userRole) : false}>
                        <DropdownMenuItem onClick={() => setSelectedReviewForFeedback(row.original)} className="capitalize p-3">
                           Add Feedback
                        </DropdownMenuItem>
                     </Conditional>
                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ];

      return columns;
   }, [auth]);

   const handleAddWeeklyReview = () => {
      setIsAddReview(false);
      refetch();
   };

   const handleAddWeeklyReviewFeedback = () => {
      setSelectedReviewForFeedback(null);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.data.map((datum) => ({
         department: datum.department.name,
         serviceDate: formatDate(datum.serviceReport.serviceDate, 'PPP'),
         submittedAt: formatDate(datum.submittedAt, 'PPP'),
         submittedBy: datum.submittedBy.firstName + ' ' + datum.submittedBy.lastName,
         feedback: datum.feedback?.length ? datum.feedback.map((item) => item.text).join(' | ') : 'N/A',
         feedbackDueForActionAt: datum.feedback?.length ? datum.feedback.map((item) => formatDate(item.dueForActionAt, 'PPP')).join(' | ') : 'N/A',
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

                  <div className="border border-[#EFEFEF] rounded-md flex flex-col">
                     <div className="border-b border-b-[#EFEFEF] bg-blue-light text-base text-main font-semibold py-3 px-3.5 capitalize">Feedback</div>

                     <div className="flex flex-col gap-3 px-3.5 py-4">
                        <Conditional visible={(selectedReview.feedback ?? []).length === 0}>
                           <div className="text-sm text-gray-neutral">No feedback has been given yet.</div>
                        </Conditional>

                        {(selectedReview.feedback ?? []).map((item) => (
                           <div key={item._id} className="border border-[#EFEFEF] rounded-md p-3 flex flex-col gap-1">
                              <div className="text-sm text-dark font-medium">{item.text}</div>
                              <div className="text-xs text-gray-neutral">
                                 Raised by {item.raisedBy.firstName} {item.raisedBy.lastName} &middot; Due {formatDate(item.dueForActionAt, 'PPP')}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="border border-[#EFEFEF] rounded-md flex flex-col">
                  <div className="border-b border-b-[#EFEFEF] bg-blue-light text-base text-main font-semibold py-3 px-3.5 capitalize">Report</div>

                  <div className="grid grid-cols-1 gap-3 px-3.5 py-4 sm:grid-cols-2">
                     {selectedReview.fields.map((field) => (
                        <div
                           key={field.label}
                           className={cn('border border-[#EFEFEF] rounded-md p-3 flex flex-col gap-1', {
                              'sm:col-span-2': String(field.value ?? '').length > 40,
                           })}
                        >
                           <div className="text-xs text-gray-neutral font-medium">{field.label}</div>
                           <div className="text-sm text-dark font-medium break-words whitespace-pre-wrap">{field.value || 'N/A'}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </Modal>
         )}

         {selectedReviewForFeedback && (
            <Modal onClose={() => setSelectedReviewForFeedback(null)} title={'Add Feedback for ' + selectedReviewForFeedback.department.name} visible>
               <AddWeeklyReviewFeedbackForm weeklyReviewId={selectedReviewForFeedback._id} onAddFeedback={handleAddWeeklyReviewFeedback} />
            </Modal>
         )}

         <Modal onClose={() => setIsWeekFeedbackVisible(false)} title="All Feedback This Week" visible={isWeekFeedbackVisible}>
            <div className="flex flex-col gap-4">
               <Conditional visible={feedbackByDepartment.length === 0}>
                  <div className="text-sm text-gray-neutral">No feedback has been given for this week yet.</div>
               </Conditional>

               {feedbackByDepartment.map((department) => (
                  <div key={department.departmentId} className="border border-[#EFEFEF] rounded-md flex flex-col">
                     <div className="border-b border-b-[#EFEFEF] bg-blue-light text-base text-main font-semibold py-3 px-3.5 capitalize">{department.departmentName}</div>

                     <div className="flex flex-col gap-3 px-3.5 py-4">
                        {department.feedback.map((item) => (
                           <div key={item._id} className="border border-[#EFEFEF] rounded-md p-3 flex flex-col gap-1">
                              <div className="text-sm text-dark font-medium">{item.text}</div>
                              <div className="text-xs text-gray-neutral">
                                 Raised by {item.raisedBy.firstName} {item.raisedBy.lastName} &middot; Due {formatDate(item.dueForActionAt, 'PPP')}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </Modal>

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

         <Conditional visible={!!weeklyReviewQuery.serviceReport}>
            <div className="p-4 md:p-6 border-b-border border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div className="text-sm">
                  <Conditional visible={missingDepartments.length === 0}>
                     <span className="font-medium text-green-700">All departments have submitted a report for this week.</span>
                  </Conditional>

                  <Conditional visible={missingDepartments.length > 0}>
                     <span className="font-medium text-dark">Yet to submit: </span>
                     <span className="text-gray-neutral">{missingDepartments.map((missing) => missing.name).join(', ')}</span>
                  </Conditional>
               </div>

               <Button
                  onClick={() => setIsWeekFeedbackVisible(true)}
                  variant="ghost"
                  className="bg-blue-light px-5 h-12 rounded-md justify-start text-left font-medium text-base text-main shrink-0"
               >
                  <span className="flex-1">View All Feedback ({feedbackCount})</span>
               </Button>
            </div>
         </Conditional>

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
