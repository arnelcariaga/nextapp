"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"

interface IScreenPermissions {
    id_role: number
    id_screen: number
    view: string
    create: string
    edit: string
    delete: string
}

interface IModules {
    id: number
    name: string
}

interface IModulesWithPermissions extends IModules {
    permissions: IScreenPermissions
}

export const screensModulesColumns = (
    handleCheckboxChange: (
        rowIndex: number,
        permission: string
    ) => void
): ColumnDef<IModulesWithPermissions>[] => [
        {
            accessorKey: "name",
            header: "Módulos",
        },
        {
            accessorKey: "permissions.view",
            header: "Ver",
            cell: ({ row }) => {
                return <Checkbox
                    checked={row.original.permissions.view === "1"}
                    onCheckedChange={() => handleCheckboxChange(row.index, 'view')}
                />
            },
        },
        {
            accessorKey: "permissions.create",
            header: "Crear",
            cell: ({ row }) => {
                return <Checkbox
                    checked={row.original.permissions.create === "1"}
                    onCheckedChange={() => handleCheckboxChange(row.index, "create")}
                />
            },
        },
        {
            accessorKey: "permissions.edit",
            header: "Editar",
            cell: ({ row }) => {
                return <Checkbox
                    checked={row.original.permissions.edit === "1"}
                    onCheckedChange={() => handleCheckboxChange(row.index, "edit")}
                />
            },
        },
        {
            accessorKey: "permissions.delete",
            header: "Eliminar",
            cell: ({ row }) => {
                return <Checkbox
                    checked={row.original.permissions.delete === "1"}
                    onCheckedChange={() => handleCheckboxChange(row.index, "delete")}
                />
            },
        },
    ]