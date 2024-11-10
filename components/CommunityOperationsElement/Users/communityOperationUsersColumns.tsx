"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ICommunityOperationUsersDataTable } from "@/lib/interfaces"
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Icon from "../../Icon";
import Link from "next/link";

export const communityOperationUsersColumns = (
    openModalEditCommunityOperationUser: (data: ICommunityOperationUsersDataTable) => void,
    openModalDeleteCommunityOperationUser: (communityOperationUserId: number) => void,
    canDelete: boolean,
    canEdit: boolean
): ColumnDef<ICommunityOperationUsersDataTable>[] => [
        {
            accessorKey: "name",
            header: "Nombre Comp.",
            cell: ({ row }) => {
                return row.original.name + " " + row.original.last_name
            }
        },
        {
            accessorKey: "referral_number",
            header: "No. Referimiento",
            enableColumnFilter: true,
        },
        {
            accessorKey: "referral_type.name",
            header: "Tipo de referimiento",
            enableColumnFilter: true,
            cell: ({ row }) => {
                return row.original.referral_type.name
            }
        },
        {
            accessorKey: "serology_status.name",
            header: "Serología",
            enableColumnFilter: true,
            cell: ({ row }) => {
                return row.original.serology_status.name
            }
        },
        {
            accessorKey: "created_at",
            header: "Creado",
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
                const serology_status = Number(row.original.serology_status_id);
                // 1 = Positivo
                // 2 = Negativo
                //3 = Positivo Conocido

                return (
                    <div className="space-x-2 flex aligns-center">
                        {
                            serology_status !== 2 && <Button variant="outline" className="border border-blue-500" asChild>
                                <Link href={`/community_operations/${communityOperationUserId}/user_profile`}>
                                    Ver Perfil
                                </Link>
                            </Button>
                        }
                        {
                            canEdit && <Button variant="secondary" size="icon" onClick={() => openModalEditCommunityOperationUser(row.original)}>
                                <Icon name='Edit' className="" />
                            </Button>
                        }

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