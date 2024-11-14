"use client"
import React, { useState } from 'react'
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TTableProps } from '@/lib/types'
import DropdownFilter from './DropDownFilter'
import * as XLSX from 'xlsx';
import Icon from '../Icon'
import { Card, CardHeader, CardContent } from '../ui/card'
import Pagination from './Pagination'
import { usePagination } from '@/hooks/usePagination'

export default function DataTable<T extends object>({
    data,
    columns,
    addBtn,
    columnBtnFilter,
    columnHidden,
    orderByObj,
    exportData
}: TTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([{ ...orderByObj }])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(columnHidden)
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    const { onPaginationChange, pagination } = usePagination()

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId)
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination
        },
        autoResetPageIndex: false,
        onPaginationChange
    })

    const exportToExcel = () => {
        // Convertir los datos a un formato de hoja de trabajo
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Crear un libro de trabajo y agregar la hoja
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Exportar el archivo
        XLSX.writeFile(workbook, 'data.xlsx');
    };

    return (
        <Card className='shadow-lg'>
            <CardHeader>
                <div className='flex justify-between items-center my-4'>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-4 w-full">
                            <Input
                                placeholder="Buscar..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="w-[50%]"
                            />

                            {addBtn}
                        </div>
                    </div>
                    {
                        exportData && <Button variant="secondary" className='bg-green-800 me-4' onClick={exportToExcel}>
                            <Icon name="CloudDownload" />
                        </Button>
                    }
                    {
                        columnBtnFilter &&
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className='border-green-600 dark:border-green-900'>
                                    Columnas
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {column.columnDef.header as string}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                </div>
            </CardHeader>
            <CardContent className='p-0'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            <div className='flex text-nowrap'>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                {
                                                    header.column.columnDef.enableColumnFilter &&
                                                    <DropdownFilter column={header.column} table={table} />
                                                }
                                            </div>

                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Pagination table={table} />
            </CardContent>
        </Card>
    )
}