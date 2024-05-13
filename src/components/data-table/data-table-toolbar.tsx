'use client';

import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { DataTableFilterField } from '@/types';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options)
    };
  }, [filterFields]);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between space-x-2 overflow-auto py-1',
        className
      )}
      {...props}
    >
      <div className='flex flex-1 items-center space-x-2'>
        {searchableColumns.length > 0 &&
          searchableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : '') && (
                <div
                  key={String(column.value)}
                  className='flex justify-between items-center h-[32px] rounded-md border border-input shadow-sm focus-within:outline-none ring-inset focus-within:ring-1 focus-within:ring-ring'
                >
                  <MagnifyingGlassIcon className='h-4 w-4 mx-2 text-muted-foreground' />
                  <Input
                    placeholder={column.placeholder}
                    value={
                      (table
                        .getColumn(String(column.value))
                        ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                      table
                        .getColumn(String(column.value))
                        ?.setFilterValue(event.target.value)
                    }
                    className='h-8 w-[126px] lg:w-[222px] border-none shadow-none pl-0 focus-visible:ring-0'
                  />
                </div>
              )
          )}
        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.value ? String(column.value) : '') && (
                <DataTableFacetedFilter
                  key={String(column.value)}
                  column={table.getColumn(
                    column.value ? String(column.value) : ''
                  )}
                  title={column.label}
                  options={column.options ?? []}
                />
              )
          )}
        {isFiltered && (
          <Button
            aria-label='Reset filters'
            variant='ghost'
            className='h-8 px-2 lg:px-3'
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <Cross2Icon className='ml-2 size-4' aria-hidden='true' />
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
