import _ from 'lodash';

import { Skeleton } from './skeleton';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PaginationProps } from '@/utils/entities';

import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTableProps<TData, TValue> {
   onPageChange: (page: number) => void;
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
   pagination: PaginationProps;
   loading: boolean;
}

export function DataTable<TData, TValue>({ columns, data, loading, pagination, onPageChange }: DataTableProps<TData, TValue>) {
   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
   });

   return (
      <div className="overflow-hidden">
         <Table>
            <TableHeader>
               {table.getHeaderGroups().map((headerGroup) => (
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
               {loading ? (
                  _.range(1, 5).map((fill) => (
                     <TableRow key={fill} className="border-b-0">
                        {columns.map((column) => (
                           <TableCell key={column.id} className="p-6">
                              <Skeleton className="h-[1rem] w-full rounded-sm" />
                           </TableCell>
                        ))}
                     </TableRow>
                  ))
               ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
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
                  <PaginationPrevious
                     href="#"
                     data-disabled={pagination.pageNumber === 1}
                     className="data-[disabled=true]:opacity-25"
                     onClick={() => onPageChange(1)}
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
                     onClick={() => onPageChange(pagination.totalPages)}
                  />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   );
}
