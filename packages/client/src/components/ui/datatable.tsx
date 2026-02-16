import _ from 'lodash';

import { useEffect, useState, useTransition } from 'react';
import { ChevronDown } from 'lucide-react';

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { type PaginationProps } from '@/utils/entities';

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
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
   pagination: PaginationProps;
   loading: boolean;
   filtering?: boolean;
}

export function DataTable<TData, TValue>({ columns, data, loading, pagination, filtering = true, onPageChange }: DataTableProps<TData, TValue>) {
   const { query, onSetSearch, onSetField } = useQueryStore();
   const { getAllColumns, getHeaderGroups, getRowModel } = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
   });

   const [searchValue, setSearchValue] = useState('');
   const [isPending, startTransition] = useTransition();

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
            <div className="flex items-center p-6 border-b border-b-border">
               <div className="flex items-center gap-x-4">
                  <Input
                     placeholder="Search..."
                     value={searchValue}
                     onChange={(event) => setSearchValue(event.target.value)}
                     className="border border-gray-200 rounded-2xl h-14 px-4 min-w-64 max-w-sm focus:outline-hidden placeholder:text-[1rem] font-medium"
                  />

                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="outline"
                           className="capitalize ml-auto border border-gray-200 rounded-2xl h-14 px-4 max-w-sm focus:outline-hidden placeholder:text-[1rem] font-medium"
                        >
                           {query.field ?? 'Search By'} <ChevronDown />
                        </Button>
                     </DropdownMenuTrigger>

                     <DropdownMenuContent align="end">
                        {getAllColumns().map((column) => {
                           return (
                              <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={query.field === column.id} onCheckedChange={() => onSetField(column.id)}>
                                 {column.id}
                              </DropdownMenuCheckboxItem>
                           );
                        })}
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>

               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" className="ml-auto border border-gray-200 rounded-2xl h-14 px-4 max-w-sm focus:outline-hidden placeholder:text-[1rem] font-medium">
                        Fields <ChevronDown />
                     </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                     {getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                           return (
                              <DropdownMenuCheckboxItem
                                 key={column.id}
                                 className="capitalize"
                                 checked={column.getIsVisible()}
                                 onCheckedChange={(value) => column.toggleVisibility(!!value)}
                              >
                                 {column.id}
                              </DropdownMenuCheckboxItem>
                           );
                        })}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </Conditional>

         <div className="overflow-hidden">
            <Table>
               <TableHeader>
                  {getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id} className="border-b-0 px-6">
                        {headerGroup.headers.map((header) => {
                           return (
                              <TableHead key={header.id} className="text-base text-main border-b-0 px-6">
                                 {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                              </TableHead>
                           );
                        })}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {loading || isPending ? (
                     _.range(1, 5).map((fill) => (
                        <TableRow key={fill} className="border-b-0">
                           {columns.map((_, index) => (
                              <TableCell key={index} className="p-6">
                                 <Skeleton className="h-[1rem] w-full rounded-sm" />
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : getRowModel().rows?.length ? (
                     getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="border-b-0" data-state={row.getIsSelected() && 'selected'}>
                           {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id} className="py-8 px-6 text-gray-neutral">
                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))
                  ) : (
                     <TableRow className="border-none border-b-0">
                        <TableCell colSpan={columns.length} className="h-24 text-center border-b-0">
                           No results.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>

            <Pagination className="pb-6">
               <PaginationContent>
                  <PaginationItem>
                     <PaginationPrevious href="#" data-disabled={pagination.pageNumber === 1} className="data-[disabled=true]:opacity-25" onClick={() => onPageChange(1)} />
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
                        onClick={() => onPageChange(pagination.totalPages)}
                     />
                  </PaginationItem>
               </PaginationContent>
            </Pagination>
         </div>
      </>
   );
}
