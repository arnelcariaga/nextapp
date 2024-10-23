"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Icon from "../Icon";

interface IScreenPermissions {
    id_role: number
    id_screen: number
    view: string
    create: string
    edit: string
    delete: string
}

interface IModulesWithPermissions {
    id: number
    name: string
    permissions: IScreenPermissions
}

interface IRolesWithScreens {
    id: number
    name: string
    is_admin: boolean
    updated_at: string
    screens: Array<IModulesWithPermissions>
}

export const rolesColumns = (
    openModalEditRol: (selectedRol: IRolesWithScreens[]) => void,
    openModalDeleteRol: (idRol: number) => void
): ColumnDef<IRolesWithScreens>[] => [
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
                const data: IRolesWithScreens[] = [row.original]
                
                return (
                    <div className="space-x-2">
                        <Button variant="secondary" onClick={() => openModalEditRol(data)}>
                            <Icon name='Edit' />
                        </Button>
                        <Button variant="destructive" onClick={() => openModalDeleteRol(rolId)}>
                            <Icon name="Trash2" />
                        </Button>
                    </div>
                )
            },
        },
    ]