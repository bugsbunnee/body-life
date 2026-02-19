import React, { useEffect, useMemo, useState } from 'react';

import { formatDate } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon } from 'lucide-react';

import { DataTable } from '@/components/ui/datatable';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { exportToExcel } from '@/lib/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { Department } from '@/utils/entities';

import AddDepartmentForm from '@/components/forms/department/add-department-form';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import Summary from '@/components/common/summary';

import useDepartments from '@/hooks/useDepartments';
import useQueryStore from '@/store/query';

const DepartmentPage: React.FC = () => {
   const { data, isFetching, refetch } = useDepartments();
   const { resetQuery, onSetDepartment } = useQueryStore();

   const [isAddDepartment, setIsAddDepartment] = useState<boolean>(false);
   const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

   const columns = useMemo(() => {
      const columns: ColumnDef<Department>[] = [
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
            accessorKey: 'name',
            header: 'Department Name',
         },
         {
            accessorKey: 'hod',
            header: 'HOD',
            cell: ({ row }) => (
               <Button
                  onClick={() => setSelectedDepartment(row.original)}
                  className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
               >
                  {row.original.hod.firstName} {row.original.hod.lastName}
               </Button>
            ),
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
                     <DropdownMenuItem onClick={() => setSelectedDepartment(row.original)} className="capitalize p-3">
                        View Department Details
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ];

      return columns;
   }, []);

   const handleAddDepartment = () => {
      setIsAddDepartment(false);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.data.map((datum) => ({
         hod: datum.hod.firstName + ' ' + datum.hod.lastName,
         name: datum.name,
         totalMembership: datum.totalMembership,
      }));

      exportToExcel(extractedData, `Departments_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <React.Fragment>
         <Header title="Departments" onSearch={(name) => onSetDepartment({ name })} />

         <Modal onClose={() => setIsAddDepartment(false)} title="Add Department" visible={isAddDepartment}>
            <AddDepartmentForm onAddDepartment={handleAddDepartment} />
         </Modal>

         {selectedDepartment && (
            <Modal onClose={() => setSelectedDepartment(null)} title="Department Details" visible>
               <div className="grid grid-cols-2 gap-4">
                  <Summary
                     title="General Information"
                     labels={[
                        {
                           key: 'Department Name',
                           value: selectedDepartment.name,
                        },
                        {
                           key: 'Department HOD',
                           value: selectedDepartment.hod.firstName + ' ' + selectedDepartment.hod.lastName,
                        },
                        {
                           key: 'Total Membership',
                           value: selectedDepartment.totalMembership.toString() + ' members',
                        },
                     ]}
                  />
               </div>
            </Modal>
         )}

         <div className="p-6 border-b-border border-b flex items-center justify-between">
            <div className="">
               <div className="text-base text-black font-semibold">Here are the departments</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">View key insights about departments here</div>
            </div>

            <div className="flex gap-x-4">
               <Button
                  onClick={() => setIsAddDepartment(true)}
                  variant="ghost"
                  className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <PlusIcon />
                  <span className="flex-1">Add Department</span>
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

         <div className="border-r border-r-border">
            <DataTable
               filtering={false}
               onSizeChange={(size) => onSetDepartment({ pageSize: size })}
               onPageChange={(page) => onSetDepartment({ pageNumber: page })}
               pagination={data.data.pagination}
               loading={isFetching}
               columns={columns}
               data={data.data.data}
            />
         </div>
      </React.Fragment>
   );
};

export default DepartmentPage;
