import React, { useMemo } from 'react';
import { Column, Table } from '@tanstack/react-table'; // Import the Column type
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Icon from '../Icon';
import { ScrollArea } from '../ui/scroll-area';
import sortMixedArray from '@/lib/sortMixedArray';

// Define the props type for DropdownFilter
interface DropdownFilterProps<TData> {
  column: Column<TData, unknown>; // This ensures column has the correct type
  table: Table<any>;
}

const DropdownFilter = <TData,>({ column, table }: DropdownFilterProps<TData>) => {
  // Get the unique values for the column
  const uniqueValues = useMemo(() => {
    const values = table.getCoreRowModel().flatRows.map(row => row.getValue(column.id)) as string[]
    return Array.from(new Set(values));
  }, [table, column]);
  const { setFilterValue } = column;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Icon name="Filter" className='ml-2' size={18} />
      </DropdownMenuTrigger>


      <DropdownMenuContent className="w-56">
        <ScrollArea className="h-96">
          <DropdownMenuItem onClick={() => setFilterValue(undefined)}>
            <span>Todos</span>
          </DropdownMenuItem>

          {uniqueValues.sort(sortMixedArray).map((value, index) => (
            <DropdownMenuItem key={index} onClick={() => setFilterValue(value)}>
              <span>{String(value)}</span>
            </DropdownMenuItem>
          ))}
        </ScrollArea>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownFilter;
