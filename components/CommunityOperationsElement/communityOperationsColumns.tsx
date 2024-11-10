"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ICommunityOperationDataTable } from "@/lib/interfaces"
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Icon from "../Icon";
import Link from "next/link";

export const communityOperationsColumns = (
    openModalEditCommunityOperation: (data: ICommunityOperationDataTable) => void,
    openModalDeleteCommunityOperation: (uId: number) => void,
    canDelete: boolean,
    canEdit: boolean
): ColumnDef<ICommunityOperationDataTable>[] => [
        {
            accessorKey: "sai.name",
            header: "Socio/SAI",
            cell: ({ row }) => row.original.sai.name,
            enableColumnFilter: true,
        },
        {
            accessorKey: "community_operation_users_count",
            header: "Cant. Usuarios",
            enableColumnFilter: true,
            filterFn: (row, columnId, filterValue) => {
                const cellValue = row.getValue(columnId);
                return cellValue === filterValue
            },
        },
        {
            accessorKey: "province.name",
            header: "Provincia",
            cell: ({ row }) => row.original.province.name,
            enableColumnFilter: true,
        },
        {
            accessorKey: "municipality.name",
            header: "Municipio",
            cell: ({ row }) => row.original.municipality.name,
            enableColumnFilter: true,
        },
        {
            accessorKey: "community_operation_type.name",
            header: "Tipo Operativo",
            cell: ({ row }) => row.original.community_operation_type.name,
            enableColumnFilter: true,
        },
        {
            accessorKey: "date",
            header: "Fecha Operativo",
            enableColumnFilter: true,
            cell: ({ row }) => {
                const parsedDate = parseISO(String(row.original.date));

                const datetime = format(parsedDate, "dd/MM/yy");
                return datetime
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
                const data = row.original
                const id = row.original.id
                return (
                    <div className="space-x-2 flex aligns-center">
                        <Button size="icon" asChild>
                            <Link href={`/community_operations/${id}/users`}>
                                <Icon name='Users' />
                            </Link>
                        </Button>
                        {
                            canEdit && <Button variant="secondary" size="icon" onClick={() => openModalEditCommunityOperation(data)}>
                                <Icon name='Edit' />
                            </Button>
                        }

                        {
                            canDelete && <Button variant="destructive" size="icon" onClick={() => openModalDeleteCommunityOperation(id)}>
                                <Icon name="Trash2" />
                            </Button>
                        }
                    </div >
                )
            },
        },
    ]