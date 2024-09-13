"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { IModules } from "@/lib/interfaces"
import { Checkbox } from "@/components/ui/checkbox"

export const screensModulesColumns = (
    handleCheckboxChange: (
        rowIndex: number,
        permission: keyof IModules["permissions"]
    ) => void
): ColumnDef<IModules>[] => [
        {
            accessorKey: "id",
            accessorFn: (row) => row?.id?.toString(),
        },
        {
            accessorKey: "name",
            header: "Módulos",
        },
        {
            accessorKey: "permissions.view",
            header: "Ver",
            cell: ({ row }) => {
                return <Checkbox
                    checked={row.original.permissions.view}
                    onCheckedChange={() => handleCheckboxChange(row.index, 'view')}
                />
            },
        },
        {
            accessorKey: "permissions.create",
            header: "Crear",
            cell: ({ row }) => {
                return <Checkbox
                    checked={row.original.permissions.create}
                    onCheckedChange={() => handleCheckboxChange(row.index, "create")}
                />
            },
        },
        {
            accessorKey: "permissions.edit",
            header: "Editar",
            cell: ({ row }) => {
                return <Checkbox
                    checked={row.original.permissions.edit}
                    onCheckedChange={() => handleCheckboxChange(row.index, "edit")}
                />
            },
        },
        {
            accessorKey: "permissions.delete",
            header: "Eliminar",
            cell: ({ row }) => {
                return <Checkbox
                    checked={row.original.permissions.delete}
                    onCheckedChange={() => handleCheckboxChange(row.index, "delete")}
                />
            },
        },
    ]