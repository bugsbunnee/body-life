import _ from 'lodash';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { ChevronDown } from 'lucide-react';

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { type PaginationProps } from '@/utils/entities';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Skeleton } from './skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from './input';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';
import { Button } from './button';

import Conditional from '../common/conditional';
import useQueryStore from '@/store/query';

interface DataTableProps<TData, TValue> {
   onPageChange: (page: number) => void;
   onSizeChange: (size: number) => void;
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
   pagination: PaginationProps;
   loading: boolean;
   filtering?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, loading, pagination, filtering = true, onPageChange, onSizeChange }: DataTableProps<TData, TValue>) {
   const { query, onSetSearch, onSetField } = useQueryStore();
   const { getAllColumns, getHeaderGroups, getRowModel } = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
   });

   const [searchValue, setSearchValue] = useState('');
   const [isPending, startTransition] = useTransition();

   const rows = getRowModel().rows ?? [];

   const isFetching = useMemo(() => {
      return loading || isPending;
   }, [loading, isPending]);

   useEffect(() => {
      const timeout = setTimeout(() => {
         startTransition(() => {
            onSetSearch(searchValue);
         });
      }, 400);

      return () => clearTimeout(timeout);
   }, [searchValue, onSetSearch]);

   return (
      <>
         <Conditional visible={filtering}>
            <div className="flex flex-col gap-3 p-4 md:p-6 border-b border-b-border sm:flex-row sm:items-center sm:justify-between">
               <div className="flex items-center gap-x-3">
                  <Input
                     placeholder="Search..."
                     value={searchValue}
                     onChange={(event) => setSearchValue(event.target.value)}
                     className="border border-gray-200 rounded-2xl h-14 px-4 w-full sm:min-w-64 sm:max-w-sm focus:outline-hidden placeholder:text-[1rem] font-medium"
                  />

                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="shrink-0 border border-gray-200 rounded-2xl h-14 px-4 focus:outline-hidden font-medium">
                           {query.field ?? 'Search By'} <ChevronDown />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        {getAllColumns().map((column) => (
                           <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={query.field === column.id} onCheckedChange={() => onSetField(column.id)}>
                              {column.id}
                           </DropdownMenuCheckboxItem>
                        ))}
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>

               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="shrink-0 border border-gray-200 rounded-2xl h-14 px-4 font-medium w-full sm:w-auto">
                        Fields <ChevronDown />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     {getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                           <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) => column.toggleVisibility(!!value)}
                           >
                              {column.id}
                           </DropdownMenuCheckboxItem>
                        ))}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </Conditional>

         <div className="block md:hidden divide-y divide-border">
            <Conditional visible={isFetching}>
               {_.range(1, 5).map((fill) => (
                  <div key={fill} className="p-4 space-y-3">
                     <Skeleton className="h-4 w-3/4 rounded-xl" />
                     <Skeleton className="h-4 w-1/2 rounded-xl" />
                     <Skeleton className="h-4 w-2/3 rounded-xl" />
                  </div>
               ))}
            </Conditional>

            <Conditional visible={!isFetching}>
               <Conditional visible={rows.length === 0}>
                  <div className="h-24 flex items-center justify-center text-center text-gray-neutral">No results.</div>
               </Conditional>

               <Conditional visible={rows.length > 0}>
                  {rows.map((row) => (
                     <div key={row.id} className="p-4 space-y-2" data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => {
                           const header = cell.column.columnDef.header;
                           const headerLabel = typeof header === 'string' ? header : cell.column.id;

                           return (
                              <div key={cell.id} className="flex items-start justify-between gap-x-4">
                                 <span className="text-sm text-gray-400 font-medium shrink-0 capitalize">{headerLabel}</span>
                                 <span className="text-sm text-gray-neutral font-medium text-right">{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                              </div>
                           );
                        })}
                     </div>
                  ))}
               </Conditional>
            </Conditional>
         </div>

         <div className="hidden md:block w-full overflow-x-auto">
            <Table>
               <TableHeader>
                  {getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id} className="border-b-0 px-6">
                        {headerGroup.headers.map((header) => (
                           <TableHead key={header.id} className="text-base text-main border-b-0 px-6">
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                           </TableHead>
                        ))}
                     </TableRow>
                  ))}
               </TableHeader>

               <TableBody>
                  <Conditional visible={isFetching}>
                     {_.range(1, 5).map((fill) => (
                        <TableRow key={fill} className="border-b-0">
                           {columns.map((_, index) => (
                              <TableCell key={index} className="p-6">
                                 <Skeleton className="h-[1rem] w-full rounded-xl" />
                              </TableCell>
                           ))}
                        </TableRow>
                     ))}
                  </Conditional>

                  <Conditional visible={!isFetching}>
                     <Conditional visible={rows.length > 0}>
                        {rows.map((row) => (
                           <TableRow key={row.id} className="border-b-0" data-state={row.getIsSelected() && 'selected'}>
                              {row.getVisibleCells().map((cell) => (
                                 <TableCell key={cell.id} className="py-8 px-6 text-gray-neutral">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                 </TableCell>
                              ))}
                           </TableRow>
                        ))}
                     </Conditional>

                     <Conditional visible={rows.length === 0}>
                        <TableRow className="border-none border-b-0">
                           <TableCell colSpan={columns.length} className="h-24 text-center border-b-0">
                              No results.
                           </TableCell>
                        </TableRow>
                     </Conditional>
                  </Conditional>
               </TableBody>
            </Table>
         </div>

         <div className="flex flex-col gap-4 p-4 border-y border-y-border sm:flex-row sm:items-center sm:justify-between">
            <Select onValueChange={(pageSize) => onSizeChange(parseInt(pageSize))} defaultValue={pagination.pageSize.toString()}>
               <SelectTrigger style={{ height: '3.5rem' }} className="rounded-xl w-full sm:max-w-52 border border-border px-4 shadow-none">
                  <SelectValue placeholder="Select Rows to View" />
               </SelectTrigger>
               <SelectContent>
                  {_.range(1, 200, 9).map((size) => (
                     <SelectItem key={size} value={size.toString()}>
                        {size}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>

            <Pagination className="mt-0">
               <PaginationContent className="flex-wrap justify-center sm:justify-end">
                  <PaginationItem>
                     <PaginationPrevious
                        href="#"
                        data-disabled={pagination.pageNumber === 1}
                        className="data-[disabled=true]:opacity-25"
                        onClick={() => onPageChange(pagination.pageNumber - 1)}
                     />
                  </PaginationItem>

                  {_.range(1, pagination.totalPages + 1).map((page) => (
                     <PaginationItem key={page}>
                        <PaginationLink href="#" onClick={() => onPageChange(page)} isActive={page === pagination.pageNumber}>
                           {page}
                        </PaginationLink>
                     </PaginationItem>
                  ))}

                  {pagination.totalPages > 2 && (
                     <PaginationItem>
                        <PaginationEllipsis />
                     </PaginationItem>
                  )}

                  <PaginationItem>
                     <PaginationNext
                        href="#"
                        data-disabled={pagination.pageNumber === pagination.totalPages}
                        className="data-[disabled=true]:opacity-25"
                        onClick={() => onPageChange(pagination.pageNumber + 1)}
                     />
                  </PaginationItem>
               </PaginationContent>
            </Pagination>
         </div>
      </>
   );
}
