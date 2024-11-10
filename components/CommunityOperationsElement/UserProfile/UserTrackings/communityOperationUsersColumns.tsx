"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { IUserCommunityUserTracking } from "@/lib/interfaces"
import { format } from "date-fns";
import Icon from "@/components/Icon";

export const communityOperationUsersColumns = (
    openModalEditCommunityOperationUser: (data: IUserCommunityUserTracking[]) => void,
    openModalDeleteCommunityOperationUserTracking: (communityOperationUserTrackingId: number) => void,
    canDelete: boolean,
    canEdit: boolean
): ColumnDef<IUserCommunityUserTracking>[] => [
        {
            accessorKey: "sai.name",
            header: "SAI",
            enableColumnFilter: true,
            cell: ({ row }) => {
                return row.original.sai.name
            }
        },
        {
            accessorKey: "date",
            header: "Fecha",
            enableColumnFilter: true,
            enableSorting: false,
            accessorFn: (row) => (format(row.date, "dd/MM/yy")),
            cell: ({ row }) => {
                return format(row.original.date, 'dd/MM/yy')
            }
        },
        {
            accessorKey: "enrolling_type.name",
            header: "Causa no enrolamiento",
            enableColumnFilter: true,
            cell: ({ row }) => {
                return row.original.enrolling_type.name
            }
        },
        {
            accessorKey: "observations",
            header: "Observaciones"
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                const communityOperationUserTrackingId = row.original.id

                return (
                    <div className="space-x-2 flex aligns-center">
                        {
                            canEdit && <Button variant="secondary" size="icon" onClick={() => openModalEditCommunityOperationUser([row.original])}>
                                <Icon name='Edit' className="" />
                            </Button>
                        }
                        {
                            canDelete && <Button variant="destructive" size="icon" onClick={() => openModalDeleteCommunityOperationUserTracking(communityOperationUserTrackingId)}>
                                <Icon name="Trash2" className="" />
                            </Button>
                        }
                    </div>
                )
            },
        },
    ]