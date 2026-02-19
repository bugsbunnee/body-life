import React, { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

import { formatDate } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DownloadCloudIcon, EllipsisVertical, PlusIcon } from 'lucide-react';

import { DataTable } from '@/components/ui/datatable';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { exportToExcel, formatAmount } from '@/lib/utils';

import type { ColumnDef } from '@tanstack/react-table';
import type { InventoryItem } from '@/utils/entities';

import { Slider } from '@/components/ui/slider';
import { RangeDatePicker } from '@/components/ui/datepicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AddInventoryItemForm from '@/components/forms/inventory-item/add-inventory-item-form';
import Conditional from '@/components/common/conditional';
import DashboardGridSkeleton from '@/components/layout/dashboard/dashboard-grid-skeleton';
import DashboardOverview from '@/components/layout/dashboard/dashboard-overview';
import Header from '@/components/common/header';
import Modal from '@/components/common/modal';
import Summary from '@/components/common/summary';

import useDepartments from '@/hooks/useDepartments';
import useQueryStore from '@/store/query';
import useInventory from '@/hooks/useInventory';

const InventoryPage: React.FC = () => {
   const { data: departments } = useDepartments();
   const { data, isFetching, refetch } = useInventory();
   const { inventoryQuery, resetQuery, onSetInventory } = useQueryStore();

   const [localPrice, setLocalPrice] = useState({ minPrice: inventoryQuery.minPrice!, maxPrice: inventoryQuery.maxPrice! });
   const [isAddInventory, setIsAddInventory] = useState<boolean>(false);
   const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);

   const columns = useMemo(() => {
      const columns: ColumnDef<InventoryItem>[] = [
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
            header: 'Item Name',
         },
         {
            accessorKey: 'description',
            header: 'Description',
         },
         {
            accessorKey: 'unitPrice',
            header: 'Unit Price',
         },
         {
            accessorKey: 'quantity',
            header: 'Quantity',
         },
         {
            accessorKey: 'datePurchased',
            header: 'Date Purchased',
            cell: ({ row }) => formatDate(new Date(row.original.datePurchased), 'PPP'),
         },
         {
            accessorKey: 'department',
            header: 'Department',
            cell: ({ row }) => (
               <Button
                  onClick={() => setSelectedInventory(row.original)}
                  className="underline bg-transparent text-main font-semibold shadow-none hover:bg-transparent cursor-pointer"
               >
                  {row.original.department.name}
               </Button>
            ),
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
                     <DropdownMenuItem onClick={() => setSelectedInventory(row.original)} className="capitalize p-3">
                        View Inventory Item Details
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            ),
         },
      ];

      return columns;
   }, []);

   const handleAddInventory = () => {
      setIsAddInventory(false);
      refetch();
   };

   const handleExtractedDataExport = () => {
      const extractedData = data.data.data.map((datum) => ({
         department: datum.department.name,
         name: datum.name,
         description: datum.description,
         datePurchased: formatDate(new Date(datum.datePurchased), 'PPP'),
         unitPrice: datum.unitPrice,
         quantity: datum.quantity,
      }));

      exportToExcel(extractedData, `Inventory_${formatDate(new Date(), 'PPP')}.xlsx`);
   };

   useEffect(() => {
      resetQuery();
   }, [resetQuery]);

   return (
      <React.Fragment>
         <Header title="Inventory" onSearch={(search) => onSetInventory({ search })} />

         <Modal onClose={() => setIsAddInventory(false)} title="Add Inventory Item" visible={isAddInventory}>
            <AddInventoryItemForm onAddInventoryItem={handleAddInventory} />
         </Modal>

         {selectedInventory && (
            <Modal onClose={() => setSelectedInventory(null)} title="Inventory Item Details" visible>
               <div className="grid grid-cols-2 gap-4">
                  <Summary
                     title="General Information"
                     labels={[
                        {
                           key: 'Inventory Item Name',
                           value: selectedInventory.name,
                        },
                        {
                           key: 'Inventory Item Description',
                           value: selectedInventory.description,
                        },
                        {
                           key: 'Date Purchased',
                           value: formatDate(selectedInventory.datePurchased, 'PPP'),
                        },
                        {
                           key: 'Department',
                           value: selectedInventory.department.name,
                        },
                     ]}
                  />

                  <Summary
                     title="Additional Information"
                     labels={[
                        {
                           key: 'Inventory Quantity',
                           value: selectedInventory.quantity.toString(),
                        },
                        {
                           key: 'Inventory Item Unit Price',
                           value: selectedInventory.unitPrice.toString(),
                        },
                        {
                           key: 'Inventory Item Total Value',
                           value: formatAmount(selectedInventory.quantity * selectedInventory.unitPrice),
                        },
                     ]}
                  />
               </div>
            </Modal>
         )}

         <div className="p-6 border-b-border border-b flex items-center justify-between">
            <div className="">
               <div className="text-base text-black font-semibold">Here is the inventory</div>
               <div className="text-base text-gray-neutral mt-[0.25rem]">View key insights about inventory here</div>
            </div>

            <div className="flex gap-x-4">
               <RangeDatePicker
                  dateRange={{ from: inventoryQuery.datePurchasedStart, to: inventoryQuery.datePurchasedEnd }}
                  onSelectRange={(range) => onSetInventory({ datePurchasedStart: range.from!, datePurchasedEnd: range.to! })}
               />

               <Button
                  onClick={() => setIsAddInventory(true)}
                  variant="ghost"
                  className="bg-main data-[empty=true]:bg-blue-light px-9 h-12 rounded-md justify-start text-left font-medium text-base text-white"
               >
                  <PlusIcon />
                  <span className="flex-1">Add Inventory Item</span>
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

         <div className="p-6 border-b-border border-b grid grid-cols-4 gap-x-4">
            <Conditional visible={isFetching}>
               {_.range(1, 5).map((fill) => (
                  <DashboardGridSkeleton key={fill} />
               ))}
            </Conditional>

            <Conditional visible={!isFetching}>
               {data.data.aggregated.map((aggregate) => (
                  <DashboardOverview key={aggregate.departmentId} label={aggregate.departmentName} value={formatAmount(aggregate.totalAmount)} />
               ))}
            </Conditional>
         </div>

         <div className="p-6 border-b-border border-b gap-x-8 grid grid-cols-2">
            <Select onValueChange={(department) => onSetInventory({ department })} defaultValue={inventoryQuery.department}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-lg border border-border px-4 shadow-none w-full">
                  <SelectValue placeholder="Filter by Department" />
               </SelectTrigger>

               <SelectContent>
                  {departments.data.data.map((day) => (
                     <SelectItem key={day._id} value={day._id}>
                        {day.name}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <div className="border border-border rounded-lg p-4">
               <div className="border border-border bg-slate-50 p-4 rounded-md items-center flex-col overflow-hidden space-y-4">
                  <div className="text-sm text-gray-500 text-center mb-4">
                     Filter by Price ({formatAmount(inventoryQuery.minPrice!)} - {formatAmount(inventoryQuery.maxPrice!)})
                  </div>

                  <Slider
                     defaultValue={[25, 50]}
                     max={6_000_000}
                     value={[localPrice.minPrice, localPrice.maxPrice]}
                     onValueChange={(value) => setLocalPrice({ minPrice: Number(value[0]), maxPrice: Number(value[1]) })}
                     onValueCommit={(value) => onSetInventory({ minPrice: Number(value[0]), maxPrice: Number(value[1]) })}
                     step={1_000}
                  />
               </div>
            </div>
         </div>

         <div className="border-r border-r-border">
            <DataTable
               filtering={false}
               onSizeChange={(size) => onSetInventory({ pageSize: size })}
               onPageChange={(page) => onSetInventory({ pageNumber: page })}
               pagination={data.data.pagination}
               loading={isFetching}
               columns={columns}
               data={data.data.data}
            />
         </div>
      </React.Fragment>
   );
};

export default InventoryPage;
