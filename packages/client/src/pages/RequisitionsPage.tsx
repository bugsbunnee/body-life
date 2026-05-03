import type React from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { useEffect, useMemo, useState } from 'react';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon } from 'lucide-react';
import { formatDate } from 'date-fns';
import { cn, exportToExcel, formatAmount, getIsRolePermitted } from '@/lib/utils';

import { RequisitionStatus, UserRole, type Requisition } from '@/utils/entities';

import AddRequisitionForm from '@/components/forms/requisition/add-requisition-form';
import Conditional from '@/components/common/conditional';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import Summary from '@/components/common/summary';
import SearchableSelect from '@/components/common/searchable-select';
import UpdateRequisitionForm from '@/components/forms/requisition/update-requisition-form';

import useAuthStore from '@/store/auth';
import useDepartments from '@/hooks/useDepartments';
import useQueryStore from '@/store/query';
import useRequisitions from '@/hooks/useRequisitions';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/datatable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RangeDatePicker } from '@/components/ui/datepicker';
import { REQUISITION_STATUS, ROLES } from '@/utils/constants';

const RequisitionsPage: React.FC = () => {
   const [isAddRequisitionVisible, setAddRequisitionVisible] = useState(false);
   const [selectedRequisitionToView, setSelectedRequisitionToView] = useState<Requisition | null>(null);
   const [selectedRequisitionToUpdate, setSelectedRequisitionToUpdate] = useState<Requisition | null>(null);

   const { auth } = useAuthStore();
   const { isFetching, data, refetch } = useRequisitions();
   const { data: departments, isFetching: isFetchingDepartments } = useDepartments();
   const { requisitionQuery, resetQuery, onSetDepartment, onSetRequisition } = useQueryStore();

   const handleRequisitionAddition = () => {
      setAddRequisitionVisible(false);
      setSelectedRequisitionToUpdate(null);
      setSelectedRequisitionToView(null);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.map((datum) => ({
         amount: datum.amount,
         description: datum.description,
         department: datum.department.name,
         requestedBy: datum.requester.firstName + ' ' + datum.requester.lastName,
         status: datum.status,
         requestedAt: formatDate(datum.createdAt, 'PPP'),
         actioner: datum.actioner ? datum.actioner.firstName + ' ' + datum.actioner.lastName : 'None',
         approvedAt: datum.approvedAt ? formatDate(datum.approvedAt, 'PPP') : 'None',
         rejectedAt: datum.rejectedAt ? formatDate(datum.rejectedAt, 'PPP') : 'None',
         disbursedAt: datum.disbursedAt ? formatDate(datum.disbursedAt, 'PPP') : 'None',
      }));

      exportToExcel(extractedData, `Members_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   const columns = useMemo(() => {
      const columns: ColumnDef<Requisition>[] = [
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
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => <span>{formatAmount(row.original.amount)}</span>,
         },
         {
            accessorKey: 'description',
            header: 'Description',
         },
         {
            accessorKey: 'department.name',
            header: 'Department',
         },
         {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
               <Badge
                  className={cn({
                     capitalize: true,
                     'bg-blue-400': row.original.status === RequisitionStatus.Disbursed,
                     'bg-amber-600': row.original.status === RequisitionStatus.Pending,
                     'bg-green-600': row.original.status === RequisitionStatus.Approved,
                     'bg-red-500': row.original.status === RequisitionStatus.Rejected,
                  })}
               >
                  {row.original.status}
               </Badge>
            ),
         },
         {
            accessorKey: 'requester._id',
            header: 'Requested By',
            cell: ({ row }) => (
               <Button
                  onClick={() => setSelectedRequisitionToView(row.original)}
                  className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
               >
                  {row.original.requester.firstName} {row.original.requester.lastName}
               </Button>
            ),
         },
         {
            accessorKey: 'actioner',
            header: 'Approved By',
            cell: ({ row }) =>
               row.original.actioner ? (
                  <Button
                     onClick={() => setSelectedRequisitionToView(row.original)}
                     className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
                  >
                     {row.original.requester.firstName} {row.original.requester.lastName}
                  </Button>
               ) : (
                  'Not Actioned Yet'
               ),
         },
         {
            accessorKey: 'updatedAt',
            header: 'Actioned At',
            cell: ({ row }) => {
               if (row.original.approvedAt) {
                  return <span>{formatDate(row.original.approvedAt, 'PPP')}</span>;
               }

               if (row.original.rejectedAt) {
                  return <span>{formatDate(row.original.rejectedAt, 'PPP')}</span>;
               }

               return <span>Not Yet Actioned</span>;
            },
         },
         {
            accessorKey: 'createdAt',
            header: 'Requested At',
            cell: ({ row }) => <span>{formatDate(row.original.createdAt, 'PPP')}</span>,
         },
         {
            accessorKey: 'disbursedAt',
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
                     <DropdownMenuItem onClick={() => setSelectedRequisitionToView(row.original)} className="capitalize p-3">
                        View Requisition Details
                     </DropdownMenuItem>

                     <Conditional visible={auth ? auth.admin.userRole === UserRole.Pastor : false}>
                        <DropdownMenuItem onClick={() => setSelectedRequisitionToUpdate(row.original)} className="capitalize p-3">
                           Update Requisition Status
                        </DropdownMenuItem>
                     </Conditional>
                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ];

      return columns;
   }, [auth]);

   const department = useMemo(() => {
      const match = departments.data.data.find((cell) => cell._id === requisitionQuery.department);
      return match ? { label: match.name, value: match._id } : undefined;
   }, [departments, requisitionQuery.department]);

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <>
         <Header title="Requisitions" onSearch={(search) => onSetRequisition({ search })} />

         <Modal onClose={() => setAddRequisitionVisible(false)} title="New Requisition Request" visible={isAddRequisitionVisible}>
            <AddRequisitionForm onAddRequisition={handleRequisitionAddition} />
         </Modal>

         {selectedRequisitionToView && (
            <Modal onClose={() => setSelectedRequisitionToView(null)} title="Requisition Details" visible>
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Summary
                     title="General"
                     labels={[
                        {
                           key: 'Description',
                           value: selectedRequisitionToView.description,
                        },
                        {
                           key: 'Department',
                           value: selectedRequisitionToView.department.name,
                        },
                        {
                           key: 'Amount',
                           value: formatAmount(selectedRequisitionToView.amount),
                        },
                     ]}
                  />

                  <Summary
                     title="Status Information"
                     labels={[
                        {
                           key: 'Status',
                           value: selectedRequisitionToView.status,
                        },
                        {
                           key: 'Requested By',
                           value: selectedRequisitionToView.requester.firstName + ' ' + selectedRequisitionToView.requester.lastName,
                        },
                        {
                           key: 'Requested At',
                           value: formatDate(selectedRequisitionToView.createdAt, 'PPP'),
                        },
                        {
                           key: 'Actioned By',
                           value: selectedRequisitionToView.actioner ? selectedRequisitionToView.actioner?.firstName + ' ' + selectedRequisitionToView.actioner?.lastName : 'N/A',
                        },
                        {
                           key: 'Approved At',
                           value: selectedRequisitionToView.approvedAt ? formatDate(selectedRequisitionToView.approvedAt, 'PPP') : 'N/A',
                        },
                        {
                           key: 'Rejected At',
                           value: selectedRequisitionToView.rejectedAt ? formatDate(selectedRequisitionToView.rejectedAt, 'PPP') : 'N/A',
                        },
                        {
                           key: 'Disbursed At',
                           value: selectedRequisitionToView.disbursedAt ? formatDate(selectedRequisitionToView.disbursedAt, 'PPP') : 'N/A',
                        },
                     ]}
                  />
               </div>
            </Modal>
         )}

         {selectedRequisitionToUpdate && (
            <Modal onClose={() => setSelectedRequisitionToUpdate(null)} title="Requisition Details" visible>
               <UpdateRequisitionForm requisitionId={selectedRequisitionToUpdate._id} onUpdateRequisition={handleRequisitionAddition} />
            </Modal>
         )}

         <div className="p-4 md:p-6 border-b-border border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <div className="text-base text-black font-semibold">Requisitions</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">Track your finances and requisitions</div>
            </div>

            <div className="flex flex-wrap gap-3">
               <RangeDatePicker
                  dateRange={{ from: requisitionQuery.startDate, to: requisitionQuery.endDate }}
                  onSelectRange={(range) => onSetRequisition({ startDate: range.from!, endDate: range.to! })}
               />

               <Button
                  onClick={() => setAddRequisitionVisible(true)}
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

         <div className="p-4 md:p-6 border-b-border border-b grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Select onValueChange={(status) => onSetRequisition({ status })} defaultValue={requisitionQuery.status}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by status" />
               </SelectTrigger>

               <SelectContent>
                  {REQUISITION_STATUS.map((status) => (
                     <SelectItem key={status.id} value={status.id}>
                        {status.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Conditional visible={auth ? getIsRolePermitted(ROLES.PASTOR_ONLY, auth.admin.userRole) : false}>
               <SearchableSelect
                  isTriggered={isFetchingDepartments}
                  onTriggerSearch={(name: string) => onSetDepartment({ name })}
                  data={departments.data.data.map((department) => ({ label: department.name, value: department._id }))}
                  value={department}
                  onValueChange={(value) => onSetRequisition({ department: value ? value.value : '' })}
                  placeholder="Filter by Department"
               />
            </Conditional>
         </div>

         <DataTable
            filtering={false}
            onSizeChange={(size) => onSetRequisition({ pageSize: size })}
            onPageChange={(page) => onSetRequisition({ pageNumber: page })}
            pagination={data.pagination}
            loading={isFetching}
            columns={columns}
            data={data.data}
         />
      </>
   );
};

export default RequisitionsPage;
