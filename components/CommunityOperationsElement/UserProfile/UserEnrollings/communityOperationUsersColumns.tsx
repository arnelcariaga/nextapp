"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { IUserCommunityUserEnrolling } from "@/lib/interfaces"
import { format, parseISO } from "date-fns";
import Icon from "@/components/Icon";

export const communityOperationUsersColumns = (
    openModalEditCommunityOperationUser: (data: IUserCommunityUserEnrolling[]) => void,
    openModalDeleteCommunityOperationUserTracking: (communityOperationUserTrackingId: number) => void,
    canDelete: boolean,
    canEdit: boolean
): ColumnDef<IUserCommunityUserEnrolling>[] => [
        {
            accessorKey: "sai.name",
            header: "SAI",
            enableColumnFilter: true,
            cell: ({ row }) => {
                return row.original.sai.name
            }
        },
        {
            accessorKey: "enrolling_date",
            header: "Fecha enrolamiento",
            enableColumnFilter: true,
            enableSorting: false,
            accessorFn: (row) => (format(row.enrolling_date, "dd/MM/yy")),
            cell: ({ row }) => {
                const date = parseISO(String(row.original.enrolling_date))
                return format(date, 'dd/MM/yy')
            }
        },
        {
            accessorKey: "treatment_start_date",
            header: "Fecha inicio tratamiento",
            enableColumnFilter: true,
            accessorFn: (row) => {
                const date = row.treatment_start_date
                return date !== null ? format(date, 'dd/MM/yy') : 'Sin fecha'
            },
            cell: ({ row }) => {
                const date = row.original.treatment_start_date
                return date !== null ? format(parseISO(String(date)), 'dd/MM/yy') : 'Sin fecha'
            }
        },
        {
            accessorKey: "tester",
            header: "Promotor que enrolea",
            enableColumnFilter: true
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