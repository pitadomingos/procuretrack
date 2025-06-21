
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

// A simplified column definition type for this basic table
export interface ColumnDef<TData> {
  accessorKey: keyof TData | string; // For direct data access
  header: React.ReactNode;
  cell?: (row: TData) => React.ReactNode; // For custom cell rendering
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  // Optional prop to render action buttons for each row
  renderRowActions?: (row: TData) => React.ReactNode;
}

export function DataTable<TData>({
  columns,
  data,
  renderRowActions,
}: DataTableProps<TData>) {
  return (
    <ScrollArea className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
            {renderRowActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.cell
                      ? column.cell(row)
                      : String((row as any)[column.accessorKey] ?? '')}
                  </TableCell>
                ))}
                {renderRowActions && (
                  <TableCell className="text-right">
                    {renderRowActions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (renderRowActions ? 1 : 0)}
                className="h-24 text-center"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
