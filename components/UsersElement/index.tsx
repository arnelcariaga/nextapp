"use client"
import { columns } from "./columns"
import DataTable from "../MyDataTable/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import MyDialog from "../MyDialog"
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

const data: Patient[] = [
    {
        id: "1",
        sai: "SAI001",
        nombre: "Juan",
        apellidos: "Pérez García",
        usuario: "juanpg",
        correo: "juan.perez@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
    {
        id: "2",
        sai: "SAI002",
        nombre: "María",
        apellidos: "López Rodríguez",
        usuario: "marialr",
        correo: "maria.lopez@example.com",
        rol: "Paciente",
        estado: "Inactivo",
    },
    {
        id: "3",
        sai: "SAI003",
        nombre: "Carlos",
        apellidos: "Gómez Fernández",
        usuario: "carlosgf",
        correo: "carlos.gomez@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
    {
        id: "4",
        sai: "SAI004",
        nombre: "Ana",
        apellidos: "Martínez Sánchez",
        usuario: "anams",
        correo: "ana.martinez@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
    {
        id: "5",
        sai: "SAI005",
        nombre: "Pedro",
        apellidos: "Ramírez Torres",
        usuario: "pedroram",
        correo: "pedro.ramirez@example.com",
        rol: "Paciente",
        estado: "Inactivo",
    },
    {
        id: "6",
        sai: "SAI006",
        nombre: "Laura",
        apellidos: "Fernández Ruiz",
        usuario: "laurafr",
        correo: "laura.fernandez@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
    {
        id: "7",
        sai: "SAI007",
        nombre: "Miguel",
        apellidos: "Sánchez López",
        usuario: "miguelsl",
        correo: "miguel.sanchez@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
    {
        id: "8",
        sai: "SAI008",
        nombre: "Carmen",
        apellidos: "García Martín",
        usuario: "carmengm",
        correo: "carmen.garcia@example.com",
        rol: "Paciente",
        estado: "Inactivo",
    },
    {
        id: "9",
        sai: "SAI009",
        nombre: "Javier",
        apellidos: "Rodríguez Pérez",
        usuario: "javierrp",
        correo: "javier.rodriguez@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
    {
        id: "10",
        sai: "SAI010",
        nombre: "Isabel",
        apellidos: "Torres Gómez",
        usuario: "isabeltg",
        correo: "isabel.torres@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
    {
        id: "11",
        sai: "SAI011",
        nombre: "Francisco",
        apellidos: "Moreno Ruiz",
        usuario: "franmr",
        correo: "francisco.moreno@example.com",
        rol: "Paciente",
        estado: "Inactivo",
    },
    {
        id: "12",
        sai: "SAI012",
        nombre: "Elena",
        apellidos: "Jiménez Santos",
        usuario: "elenajs",
        correo: "elena.jimenez@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
    {
        id: "13",
        sai: "SAI013",
        nombre: "Antonio",
        apellidos: "Díaz Fernández",
        usuario: "antoniodf",
        correo: "antonio.diaz@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
    {
        id: "14",
        sai: "SAI014",
        nombre: "Lucía",
        apellidos: "Hernández Martínez",
        usuario: "luciahm",
        correo: "lucia.hernandez@example.com",
        rol: "Paciente",
        estado: "Inactivo",
    },
    {
        id: "15",
        sai: "SAI015",
        nombre: "Manuel",
        apellidos: "Ortega Sanz",
        usuario: "manuelos",
        correo: "manuel.ortega@example.com",
        rol: "Paciente",
        estado: "Activo",
    },
]

export default function UserElement() {
    return (
        <div className="w-full p-2">
            <DataTable
                data={data}
                columns={columns}
                addBtn={
                    <MyDialog
                        title="Agregar Rol"
                        description=""
                        content={<h1>Hi</h1>}
                        btnTrigger={<></>}
                        myClassName=""
                        closeModal
                        onOpenChange={() => {}}
                        closeBtnProps={{}}
                    />
                }
                columnBtnFilter
                columnHidden={{
                    id: true
                }}
                orderByObj={{
                    id: "",
                    desc: true
                }}
            />
        </div>
    )
}