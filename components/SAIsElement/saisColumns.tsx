"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ISai } from "@/lib/interfaces"
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Icon from "../Icon";

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
                    <Button variant="secondary" onClick={() => openModalEditSai(uId)}>
                        <Icon name='Edit' />
                    </Button>
                    <Button variant="destructive" onClick={() => openModalDeleteSai(uId, name)}>
                        <Icon name="Trash2" />
                    </Button>
                </div>
            )
        },
    },
]