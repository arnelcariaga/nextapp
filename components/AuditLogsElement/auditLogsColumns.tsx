"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { IAuditLogs } from "@/lib/interfaces"
import { format } from "date-fns";
import Icon from "../Icon";

export const auditLogsColumns = (openModalMoreInfo: (data: IAuditLogs) => void): ColumnDef<IAuditLogs>[] => [
    {
        accessorKey: "user.username",
        header: "Usuario",
        enableColumnFilter: true,
    },
    {
        accessorKey: "screen.name",
        header: "Pantalla",
        enableColumnFilter: true,
    },
    {
        accessorKey: "action",
        header: "Acción",
        enableColumnFilter: true,
    },
    {
        accessorKey: "created_at",
        header: "Fecha/Hora",
        cell: ({ row }) => {
            const formattedDate = format(new Date(row.original.created_at), 'd/M/yy');  // Formato de la fecha
            const formattedTime = format(new Date(row.original.created_at), 'hh:mm a');
            return <>
                {formattedDate}
                <br />
                {formattedTime}
            </>
        }
    },
    {
        accessorKey: "details",
        header: "Detalles"
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => <Button variant="secondary" size="icon" onClick={() => openModalMoreInfo(row.original)}>
        <Icon name='Info' className="" />
    </Button>
    },
]