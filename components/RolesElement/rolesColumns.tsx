"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { IRolesScreens } from "@/lib/interfaces"
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const rolesColumns = (openModalEditRol: (idRol:number) => void, openModalDeleteRol: (idRol:number) => void): ColumnDef<IRolesScreens>[] => [
    {
        accessorKey: "name",
        header: "Rol",
        enableSorting: true,
    },
    {
        accessorKey: "screens",
        header: "Acceso a pantalla(s)",
        enableSorting: true,
        cell: ({ row }) => {
            const screens = row.original.screens
            const is_admin = row.original.is_admin

            return is_admin ? "Acceso a todas las pantallas y módulos" : screens.length === 0 ? "Sin acceso a pantalla o módulo" :
                screens.map(({ name }, i) => <p key={i}>{name}</p>)
        }

    },
    {
        accessorKey: "updated_at",
        header: "Última actualización",
        enableSorting: true,
        cell: ({row}) => {
            const datetime = formatDistanceToNow(new Date(row.original.updated_at), { addSuffix: true, locale: es });
            return datetime
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const rolId = row.original.id
            return (
                <div className="space-x-2">
                    <Button variant="secondary" onClick={() => openModalEditRol(rolId)}>Editar</Button>
                    <Button variant="destructive" onClick={() => openModalDeleteRol(rolId)}>Eliminar</Button>
                </div>
            )
        },
    },
]