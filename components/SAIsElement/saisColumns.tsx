"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ISai } from "@/lib/interfaces"
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Icon from "../Icon";
import { Badge } from "@/components/ui/badge"

export const saisColumns = (openModalEditSai: (id: number) => void, openModalDeleteSai: (uId: number, name: string) => void): ColumnDef<ISai>[] => [
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => row.original.name
    },
    {
        accessorKey: "type",
        header: "Tipo",
        enableColumnFilter: true,
    },
    {
        accessorKey: "component",
        header: "Componente",
        enableColumnFilter: true,
    },
    {
        accessorKey: "region",
        header: "Región",
        enableColumnFilter: true,
    },
    {
        accessorKey: "province.name",
        header: "Provincia",
        cell: ({ row }) => row.original.province.name,
        enableColumnFilter: true,
    },
    {
        accessorKey: "municipe.name",
        header: "Municipio",
        cell: ({ row }) => row.original.municipe.name,
        enableColumnFilter: true,
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
        accessorKey: "created_at",
        header: "Agregado",
        cell: ({ row }) => {
            const datetime = formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true, locale: es });
            return datetime
        }
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const uId = row.original.id
            const name = row.original.name
            return (
                <div className="space-x-2 flex aligns-center">
                    <Button variant="secondary" size="icon" onClick={() => openModalEditSai(uId)}>
                        <Icon name='Edit' className="" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => openModalDeleteSai(uId, name)}>
                        <Icon name="Trash2" className="" />
                    </Button>
                </div>
            )
        },
    },
]