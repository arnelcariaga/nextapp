"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ICommunityOperationUsers } from "@/lib/interfaces"
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import Icon from "../../Icon";
import Link from "next/link";

export const communityOperationUsersColumns = (
    openModalDeleteCommunityOperationUser: (communityOperationUserId: number) => void,
    canDelete: boolean
): ColumnDef<ICommunityOperationUsers>[] => [
        {
            accessorKey: "fapps_id",
            header: "IDFAPPS",
            enableColumnFilter: true,
            filterFn: (row, columnId, filterValue) => {
                const cellValue = row.getValue(columnId);
                return cellValue === filterValue
            },
            accessorFn: (row) => (row.fapps_id === null || row.fapps_id === 0 ? "Sin ID FAPPS" : row.fapps_id),
            cell: ({ row }) => row.original.fapps_id === null || row.original.fapps_id === 0 ? "Sin ID FAPPS" : row.original.fapps_id
        },
        {
            accessorKey: "name",
            header: "Nombre Comp.",
            accessorFn: (row) => (row.name + " " + row.last_name),
            cell: ({ row }) => {
                return row.original.name + " " + row.original.last_name
            }
        },
        {
            accessorKey: "referral_number",
            header: "No. Ref.",
            enableColumnFilter: true,
            filterFn: (row, columnId, filterValue) => {
                const cellValue = row.getValue(columnId);
                return cellValue === filterValue
            },
        },
        {
            accessorKey: "referral_type.name",
            header: "Tipo Ref.",
            enableColumnFilter: true,
            cell: ({ row }) => {
                return row.original.referral_type.name
            }
        },
        {
            accessorKey: "serology_status.name",
            header: "Serología",
            enableColumnFilter: true,
            filterFn: (row, columnId, filterValue) => {
                const cellValue = row.getValue(columnId);
                return cellValue === filterValue
            },
            cell: ({ row }) => {
                return row.original.serology_status.name
            }
        },
        {
            accessorKey: "community_operation.sai.name",
            header: "SAI",
            enableColumnFilter: true,
            cell: ({ row }) => {
                return row.original.community_operation.sai.name
            }
        },
        {
            accessorKey: "community_operation.date",
            header: "Fecha Op.",
            enableColumnFilter: true,
            accessorFn: (row) => (format(row.community_operation.date, "dd/MM/yy"))
        },
        {
            accessorKey: "community_operation.province.name",
            header: "Provincia Op.",
            enableColumnFilter: true,
            cell: ({ row }) => {
                return row.original.community_operation.province.name
            }
        },
        {
            accessorKey: "community_operation.municipality.name",
            header: "Provincia Op.",
            enableColumnFilter: true,
            cell: ({ row }) => {
                return row.original.community_operation.municipality.name
            }
        },
        {
            accessorKey: "created_at",
            header: "Usuario Creado",
            cell: ({ row }) => {
                const datetime = formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true, locale: es });
                return datetime
            }
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                const communityOperationUserId = row.original.id

                return (
                    <div className="space-x-2 flex aligns-center">
                        <Button variant="outline" className="border border-blue-500" asChild>
                            <Link href={`/community_operations/${communityOperationUserId}/user_profile`}>
                                Ver Perfil
                            </Link>
                        </Button>
                        {
                            canDelete && <Button variant="destructive" size="icon" onClick={() => openModalDeleteCommunityOperationUser(communityOperationUserId)}>
                                <Icon name="Trash2" className="" />
                            </Button>
                        }
                    </div>
                )
            },
        },
    ]