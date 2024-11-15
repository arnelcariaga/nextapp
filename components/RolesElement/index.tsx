"use client"
import { useState } from "react"
import { rolesColumns } from "./rolesColumns"
import DataTable from "../MyDataTable/data-table"
import MyDialog from "../MyDialog"
import AddRolForm from "./AddRolForm"
import { deleteRol } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { setCloseModalAddRol, setCloseModalEditRol } from "@/redux/slices/rolesSlice"
import EditRolForm from "./EditRolForm"
import TableSkeleton from "../TableSkeleton"
//import { useSession } from "next-auth/react"
import Icon from "../Icon"
import { revalidateFn } from "../../lib/revalidateActions"
import { ISession } from "@/lib/interfaces"

interface IScreenPermissions {
    id_role: number
    id_screen: number
    view: string
    create: string
    edit: string
    delete: string
}

interface IModules {
    id: number
    name: string
}

interface IModulesWithPermissions extends IModules {
    permissions: IScreenPermissions
}

interface IRolesWithScreens {
    id: number
    name: string
    is_admin: boolean
    updated_at: string
    screens: Array<IModulesWithPermissions>
}

interface IComponentProps {
    data: IRolesWithScreens[]
    session: ISession['session']
}

export default function RolesElement({ data, session }: IComponentProps) {
    //const [rolesData, setRolesData] = useState<IRolesWithScreens[]>([])
    const { toast } = useToast()
    const dispatch = useDispatch()
    const closeModalAddRol = useSelector((state: RootState) => state.roles.closeModalAddRol)
    const closeModalEditRol = useSelector((state: RootState) => state.roles.closeModalEditRol)
    //const addedRoles = useSelector((state: RootState) => state.roles.addedRoles as IRolesWithScreens[])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [sendingDelete, setSendingDelete] = useState(false);
    const [selectedRolData, setSelectedRolData] = useState<IRolesWithScreens[]>([])
    //const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    //const { data: session } = useSession()

    // useEffect(() => {
    //     async function getRolesFn() {
    //         const { error, data, message } = await getRoles()

    //         if (error) {
    //             toast({
    //                 variant: "destructive",
    //                 title: "Roles || " + appName,
    //                 description: message,
    //                 duration: 5000
    //             })
    //         } else {
    //             setRolesData([...data])
    //         }
    //         setDataTableLoading(false)
    //     }
    //     getRolesFn()
    // }, [toast])

    // useEffect(() => {
    //     function getAddedRol() {
    //         // If a new rol added, update array for UI
    //         if (addedRoles.length > 0) {
    //             setRolesData((prevS) => {
    //                 const index = prevS.findIndex(item => item.id === addedRoles[0].id)

    //                 if (index !== -1) {
    //                     const updatedItems = [...prevS]

    //                     updatedItems[index] = addedRoles[0]
    //                     return updatedItems
    //                 } else {
    //                     return [addedRoles[0], ...prevS] as IRolesWithScreens[]
    //                 }
    //             })
    //         }
    //     }
    //     getAddedRol()
    // }, [addedRoles])

    // For deleting role
    
    const openModalDeleteRol = (rolId: number) => {
        setOpenDeleteModal(true)
        setSelectedRolData([{ id: rolId } as IRolesWithScreens])
    }

    const deleteRolFn = async () => {
        setSendingDelete(true)

        const userData = {
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username,
        }

        const { error, message } = await deleteRol(Number(selectedRolData[0].id), Array(userData))
        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar Rol || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            // const rolId = data["rol_id"]
            // const newRolData = rolesData.filter((item) => item.id !== rolId)
            // setRolesData(newRolData)
            await revalidateFn('/roles')
            setOpenDeleteModal(false)
            toast({
                title: "Eliminar Rol || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingDelete(false)
    }

    // For editing rol
    const openModalEditRol = async (selectedRol: IRolesWithScreens[]) => {
        dispatch(setCloseModalEditRol(true))
        setSelectedRolData(selectedRol)
    }

    return (
        <div className="w-full p-2">
            {
                !data ? <TableSkeleton /> :
                    <DataTable
                        data={data}
                        columns={rolesColumns(openModalEditRol, openModalDeleteRol)}
                        addBtn={
                            <Button variant="outline" className='bg-green-600 dark:bg-green-900' onClick={() => dispatch(setCloseModalAddRol(true))}>
                                <Icon name='Plus' className="mr-2 h-4 w-4 text-white" />
                                <span className='text-white'>
                                    Agregar Rol
                                </span>
                            </Button>
                        }
                        columnBtnFilter
                        columnHidden={{}}
                        orderByObj={{
                            id: 'updated_at',
                            desc: true
                        }}
                        exportData={false}
                    />
            }

            <MyDialog
                title="Agregar Rol"
                description=""
                content={<AddRolForm />}
                btnTrigger={<></>}
                myClassName="max-w-[100vw] h-full max-h-[100vh]"
                closeModal={closeModalAddRol}
                onOpenChange={() => dispatch(setCloseModalAddRol(!closeModalAddRol))}
            />

            <MyDialog
                title="Eliminar Rol"
                description="¿Estas seguro que quieres eliminar este rol?"
                content={
                    <Button
                        variant="destructive"
                        className="border-red-500 float-end self-end"
                        disabled={sendingDelete}
                        onClick={deleteRolFn}>
                        {
                            sendingDelete && <Icon name='Loader2' className="mr-2 h-4 w-4 animate-spin" />
                        }
                        Eliminar
                    </Button>
                }
                btnTrigger={<></>}
                myClassName=""
                closeModal={openDeleteModal}
                onOpenChange={() => setOpenDeleteModal(!openDeleteModal)}
            />

            <MyDialog
                title="Editar Rol"
                description=""
                content={
                    <EditRolForm selectedRol={selectedRolData[0]} />
                }
                btnTrigger={<></>}
                myClassName="max-w-[100vw] h-full max-h-[100vh]"
                closeModal={closeModalEditRol}
                onOpenChange={() => dispatch(setCloseModalEditRol(!closeModalEditRol))}
            />
        </div>
    )
}