"use client"
import { useEffect, useState } from "react"
import { usersColumns } from "./usersColumns"
import DataTable from "../MyDataTable/data-table"
import MyDialog from "../MyDialog"
import AddUserForm from "./AddUserForm"
import { getUsers, deleteUser } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { setCloseModalAddUser, setCloseModalEditUser } from "@/redux/slices/usersSlice"
import { IUserData } from "@/lib/interfaces"
import EditUserForm from "./EditUserForm"
import TableSkeleton from "../MyDataTable/TableSkeleton"
import { useSession } from "next-auth/react"

export default function UsersElement() {
    const [usersData, setUsersData] = useState<IUserData[]>([])
    const { toast } = useToast()
    const dispatch = useDispatch()
    const addedUsers = useSelector((state: RootState) => state.users.addedUsers as IUserData[])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [sendingDelete, setSendingDelete] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number>(0)
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const closeModalAddUser = useSelector((state: RootState) => state.users.closeModalAddUser)
    const closeModalEditUser = useSelector((state: RootState) => state.users.closeModalEditUser)
    const [selectedUsername, setSelectedUsername] = useState<string>("")
    const { data: session } = useSession()

    useEffect(() => {
        async function getUsersFn() {
            const { error, data, message } = await getUsers()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Roles || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setUsersData([...data])
            }
            setDataTableLoading(false)
        }
        getUsersFn()
    }, [toast])

    useEffect(() => {
        function getAddedRol() {
            // If a new rol added, update array for UI
            if (addedUsers.length > 0) {
                setUsersData((prevS) => {
                    const index = prevS.findIndex(item => item.id === addedUsers[0].id)

                    if (index !== -1) {
                        const updatedItems = [...prevS]

                        updatedItems[index] = addedUsers[0]
                        return updatedItems
                    } else {
                        return [addedUsers[0], ...prevS] as IUserData[]
                    }
                })
            }
        }
        getAddedRol()
    }, [addedUsers])

    // For deleting user
    const openModalDeleteUser = (uId: number, username: string) => {
        setOpenDeleteModal(true)
        setSelectedUserId(uId)
        setSelectedUsername(username)
    }

    const deleteUserFn = async () => {
        setSendingDelete(true)

        const userData = [{
            username: selectedUsername,
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username,
        }]

        const { error, data, message } = await deleteUser(selectedUserId, userData)
        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar Usuario || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            setUsersData((prevS) => {
                return prevS.map((user) => {
                    return user.id === data.id ? { ...data, ...prevS } : user
                }
                )
            })
            setOpenDeleteModal(false)
            toast({
                title: "Eliminar Usuario || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingDelete(false)
    }

    // For editing user
    const openModalEditUser = async (uId: number) => {
        dispatch(setCloseModalEditUser(true))
        setSelectedUserId(uId)
    }

    return (
        <div className="w-full p-2">
            {
                dataTableLoading ? <TableSkeleton /> :
                    <DataTable
                        data={usersData}
                        columns={usersColumns(openModalEditUser, openModalDeleteUser)}
                        addBtn={
                            <Button variant="outline" className='bg-green-600 dark:bg-green-900' onClick={() => dispatch(setCloseModalAddUser(true))}>
                                <Plus className="mr-2 h-4 w-4 text-white" />
                                <span className='text-white'>
                                    Agregar Usuario
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
                title="Agregar Usuario"
                description=""
                content={<AddUserForm />}
                btnTrigger={<></>}
                myClassName="max-w-[85vw] h-full max-h-[85vh]"
                closeModal={closeModalAddUser}
                onOpenChange={() => dispatch(setCloseModalAddUser(!closeModalAddUser))}
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                    className: "w-full mt-4"
                }}
            />

            <MyDialog
                title="Eliminar Usuario"
                description="¿Estas seguro que quieres eliminar este usuario?"
                content={
                    <Button
                        variant="destructive"
                        className="border-red-500 float-end self-end"
                        disabled={sendingDelete}
                        onClick={deleteUserFn}>
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
                title="Editar Usuario"
                description=""
                content={
                    <EditUserForm selectedUserId={selectedUserId} />
                }
                btnTrigger={<></>}
                myClassName="max-w-[85vw] h-full max-h-[85vh]"
                closeModal={closeModalEditUser}
                onOpenChange={() => dispatch(setCloseModalEditUser(!closeModalEditUser))}
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                    className: "w-full mt-4"
                }}
            />
        </div>
    )
}