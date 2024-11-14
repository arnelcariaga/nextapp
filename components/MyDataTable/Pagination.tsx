import { useState } from "react"
import { Button } from "@/components/ui/button"
import Icon from '../Icon'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table
} from "@tanstack/react-table"

interface MyComponentProps<TData> {
    table: Table<TData>
}

const sizes = [10, 15, 20, 30, 40, 50, 100]

function Pagination<TData>({ table }: MyComponentProps<TData>) {
    const [selectedPageSize, setSelectedPageSize] = useState('10');

    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();
    const pagesToShow = 5;

    const startPage = Math.max(0, pageIndex - Math.floor(pagesToShow / 2));
    const endPage = Math.min(pageCount - 1, startPage + pagesToShow - 1);

    return (
        <div className="flex items-center justify-between space-x-2 py-4 mx-4">
            <div className='flex items-center gap-x-5'>
                <div className="flex-1 text-sm text-muted-foreground">
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    {" "} | {table.getFilteredRowModel().rows.length} fila(s) en total.
                </div>

                <div className='flex items-center text-sm text-muted-foreground gap-x-2'>
                    <span>Mostrar:</span>
                    <Select
                        value={selectedPageSize}
                        onValueChange={(val) => {
                            setSelectedPageSize(val)
                            table.setPageSize(parseInt(val))
                        }}
                    >
                        <SelectTrigger className="w-[100px] size-fit">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {
                                    sizes.map((s) => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <span>por p&aacute;gina</span>
                </div>

            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    <Icon name='ChevronsLeft' className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <Icon name='ChevronLeft' className="h-4 w-4" />
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
                    <Icon name='ChevronRight' className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(pageCount - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <Icon name='ChevronsRight' className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default Pagination