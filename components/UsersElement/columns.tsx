"use client"
import {
    ColumnDef
} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    MoreHorizontal
} from "lucide-react"

interface Patient {
    id: string
    sai: string
    nombre: string
    apellidos: string
    usuario: string
    correo: string
    rol: string
    estado: string
}

export const columns: ColumnDef<Patient>[] = [
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
            const patient = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuCheckboxItem
                            onClick={() => console.log("View patient", patient.id)}
                        >
                            Ver detalles
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onClick={() => console.log("Edit patient", patient.id)}
                        >
                            Editar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            onClick={() => console.log("Delete patient", patient.id)}
                        >
                            Eliminar
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
    {
        accessorKey: "sai",
        header: "SAI",
    },
    {
        accessorKey: "nombre",
        header: "Nombre",
    },
    {
        accessorKey: "apellidos",
        header: "Apellido(s)",
    },
    {
        accessorKey: "usuario",
        header: "Usuario",
    },
    {
        accessorKey: "correo",
        header: "Correo",
    },
    {
        accessorKey: "rol",
        header: "Rol",
    },
    {
        accessorKey: "estado",
        header: "Estado",
    },
]