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
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react"
import { TTableProps } from '@/lib/types'
import DropdownFilter from './DropDownFilter'
import * as XLSX from 'xlsx';
import Icon from '../Icon'
import { Card, CardHeader, CardContent } from '../ui/card'

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
            globalFilter
        },
        autoResetPageIndex: false
    })

    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();
    const pagesToShow = 5;

    const startPage = Math.max(0, pageIndex - Math.floor(pagesToShow / 2));
    const endPage = Math.min(pageCount - 1, startPage + pagesToShow - 1);

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
        <Card className='rounded-none'>
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
                {/* <div className="flex items-center justify-between space-x-2 py-4 mx-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} de{" "}
                        {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((pageNumber) => (
                            <Button
                                key={pageNumber}
                                variant={table.getState().pagination.pageIndex + 1 === pageNumber ? "default" : "outline"}
                                size="sm"
                                onClick={() => table.setPageIndex(pageNumber - 1)}
                                type='button'
                            >
                                {pageNumber}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div> */}
                <div className="flex items-center justify-between space-x-2 py-4 mx-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                        {" "} | {table.getFilteredRowModel().rows.length} fila(s) en total.
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((pageNumber) => (
                            <Button
                                key={pageNumber}
                                variant={table.getState().pagination.pageIndex === pageNumber ? "default" : "outline"}
                                size="sm"
                                onClick={() => table.setPageIndex(pageNumber)}
                                type="button"
                            >
                                {pageNumber + 1}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(pageCount - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}