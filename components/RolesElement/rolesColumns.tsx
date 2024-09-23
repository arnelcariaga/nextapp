"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { IRolesScreens } from "@/lib/interfaces"
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { TSelectedRolObj } from "@/lib/types";
import { Badge } from "@/components/ui/badge"

export const rolesColumns = (openModalEditRol: ({ id, name }: TSelectedRolObj) => void, openModalDeleteRol: (idRol: number) => void): ColumnDef<IRolesScreens>[] => [
    {
        accessorKey: "name",
        enableColumnFilter: true,
        header: "Rol"
    },
    {
        accessorKey: "screens",
        header: "Acceso a pantalla(s)",
        cell: ({ row }) => {
            const screens = row.original.screens
            const is_admin = row.original.is_admin

            return is_admin ? "Acceso a todas las pantallas" : screens.length === 0 ? "Sin acceso a ninguna pantalla" :
                screens.map(({ name }, i) => <p key={i}>{name}</p>)
        }

    },
    {
        accessorKey: "status",
        accessorFn: (row) => (row.status === 1 ? 'Activo' : 'Inactivo'),
        header: "Status",
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
            const statusValue = row.getValue<number>(columnId); // Get the actual number value from the row
            // Compare filter value ('Activo'/'Inactivo') with actual data (1 or 2)
            if (filterValue === 'Activo') return String(statusValue) === "Activo";
            if (filterValue === 'Inactivo') return String(statusValue) === "Inactivo";
            return true; // Show all if no filter
        },
        cell: (info) => {
            const val = info.getValue()
            return val === "Inactivo" ? <Badge variant="destructive">Inactivo</Badge> : <Badge variant="secondary">Activo</Badge>
        }
    },
    {
        accessorKey: "updated_at",
        header: "Última actualización",
        cell: ({ row }) => {
            const datetime = formatDistanceToNow(new Date(row.original.updated_at), { addSuffix: true, locale: es });
            return datetime
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const rolId = row.original.id
            const rolName = row.original.name
            return (
                <div className="space-x-2">
                    <Button variant="secondary" onClick={() => openModalEditRol({ id: rolId, name: rolName })}>Editar</Button>
                    <Button variant="destructive" onClick={() => openModalDeleteRol(rolId)}>Eliminar</Button>
                </div>
            )
        },
    },
]