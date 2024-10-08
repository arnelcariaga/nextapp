"use client"
import { useEffect, useState } from "react"
import { rolesColumns } from "./rolesColumns"
import DataTable from "../MyDataTable/data-table"
import MyDialog from "../MyDialog"
import AddRolForm from "./AddRolForm"
import { getRoles, deleteRol } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { setCloseModalAddRol, setCloseModalEditRol, setAddedRoles } from "@/redux/slices/rolesSlice"
import { IRolesScreens } from "@/lib/interfaces"
import EditRolForm from "./EditRolForm"
import TableSkeleton from "../MyDataTable/TableSkeleton"
import { TSelectedRolObj } from "@/lib/types"
import { useSession } from "next-auth/react"

export default function RolesElement() {
    const [rolesData, setRolesData] = useState<IRolesScreens[]>([])
    const { toast } = useToast()
    const dispatch = useDispatch()
    const closeModalAddRol = useSelector((state: RootState) => state.roles.closeModalAddRol)
    const closeModalEditRol = useSelector((state: RootState) => state.roles.closeModalEditRol)
    const addedRoles = useSelector((state: RootState) => state.roles.addedRoles as IRolesScreens[])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [sendingDelete, setSendingDelete] = useState(false);
    const [selectedRolData, setSelectedRolData] = useState<TSelectedRolObj>({
        id: 0,
        name: ""
    })
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const { data: session } = useSession()

    useEffect(() => {
        async function getRolesFn() {
            const { error, data, message } = await getRoles()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Roles || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setRolesData([...data])
            }
            setDataTableLoading(false)
        }
        getRolesFn()
    }, [toast])

    useEffect(() => {
        function getAddedRol() {
            // If a new rol added, update array for UI
            if (addedRoles.length > 0) {
                setRolesData((prevS) => {
                    const index = prevS.findIndex(item => item.id === addedRoles[0].id)

                    if (index !== -1) {
                        const updatedItems = [...prevS]

                        updatedItems[index] = addedRoles[0]
                        return updatedItems
                    } else {
                        return [addedRoles[0], ...prevS] as IRolesScreens[]
                    }
                })
            }
        }
        getAddedRol()
    }, [addedRoles])

    // For deleting role
    const openModalDeleteRol = (rolId: number) => {
        setOpenDeleteModal(true)
        setSelectedRolData({
            id: rolId,
            name: ""
        })
    }

    const deleteRolFn = async () => {
        setSendingDelete(true)

        const userData = {
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username,
        }

        const { error, data, message } = await deleteRol(selectedRolData.id, Array(userData))
        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar Rol || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            dispatch(setAddedRoles([{ ...data }]))
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
    const openModalEditRol = async (selectedRol: TSelectedRolObj) => {
        dispatch(setCloseModalEditRol(true))
        setSelectedRolData(selectedRol)
    }

    return (
        <div className="w-full p-2">
            {
                dataTableLoading ? <TableSkeleton /> :
                    <DataTable
                        data={rolesData}
                        columns={rolesColumns(openModalEditRol, openModalDeleteRol)}
                        addBtn={
                            <Button variant="outline" className='bg-green-600 dark:bg-green-900' onClick={() => dispatch(setCloseModalAddRol(true))}>
                                <Plus className="mr-2 h-4 w-4 text-white" />
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
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                    className: "w-full mt-4"
                }}
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
                            sendingDelete && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        }
                        Eliminar
                    </Button>
                }
                btnTrigger={<></>}
                myClassName=""
                closeModal={openDeleteModal}
                onOpenChange={() => setOpenDeleteModal(!openDeleteModal)}
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                }}
            />

            <MyDialog
                title="Editar Rol"
                description=""
                content={
                    <EditRolForm selectedRol={selectedRolData} />
                }
                btnTrigger={<></>}
                myClassName="max-w-[100vw] h-full max-h-[100vh]"
                closeModal={closeModalEditRol}
                onOpenChange={() => dispatch(setCloseModalEditRol(!closeModalEditRol))}
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                    className: "w-full mt-4"
                }}
            />
        </div>
    )
}