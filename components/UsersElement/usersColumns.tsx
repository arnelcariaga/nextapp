"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { IUserData } from "@/lib/interfaces"
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Icon from "../Icon";
import { Badge } from "@/components/ui/badge"

export const usersColumns = (openModalEditUser: (id: number) => void, openModalDeleteUser: (uId: number, username: string) => void, signInAs: (uId: number) => void, loadingSignAs: boolean): ColumnDef<IUserData>[] => [
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const uId = row.original.id
            const username = row.original.username
            return (
                <div className="space-x-2 flex aligns-center">
                    <Button variant="default" className="bg-amber-500" onClick={() => signInAs(uId)} disabled={loadingSignAs}>
                        {
                            loadingSignAs && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                        }
                        Iniciar sesi&oacute;n
                    </Button>
                    <Button variant="secondary" onClick={() => openModalEditUser(uId)} disabled={loadingSignAs}>
                        <Icon name='Edit' />
                    </Button>
                    <Button variant="destructive" onClick={() => openModalDeleteUser(uId, username)} disabled={loadingSignAs}>
                        <Icon name="Trash2" />
                    </Button>
                </div>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Nombre Comp.",
        cell: ({ row }) => row.original.name + " " + row.original.last_name,
    },
    {
        accessorKey: "sai.name",
        header: "SAI",
        enableColumnFilter: true,
    },
    {
        accessorKey: "role.name",
        header: "Rol",
        enableColumnFilter: true,
    },
    {
        accessorKey: "email",
        header: "Correo"
    },
    {
        accessorKey: "username",
        header: "Usuario",
        cell: ({ row }) => row.original.username
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
        header: "Actualizado",
        cell: ({ row }) => {
            const datetime = formatDistanceToNow(new Date(row.original.updated_at), { addSuffix: true, locale: es });
            return datetime
        }
    }
]