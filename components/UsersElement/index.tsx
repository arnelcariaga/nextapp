"use client"
import { useState } from "react"
import { usersColumns } from "./usersColumns"
import DataTable from "../MyDataTable/data-table"
import MyDialog from "../MyDialog"
import AddUserForm from "./AddUserForm"
import { deleteUser } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import Icon from "../Icon"
import { setCloseModalAddUser, setCloseModalEditUser } from "@/redux/slices/usersSlice"
import { IUserData } from "@/lib/interfaces"
import EditUserForm from "./EditUserForm"
import TableSkeleton from "../TableSkeleton"
import { useSession } from "next-auth/react"
import { signInServerFunc } from "./signInServerFunc"
import { revalidateFn } from "../CommunityOperationsElement/revalidateActions"

interface IComponentProps {
    data: IUserData[]
}

export default function UsersElement({ data }: IComponentProps) {
    //const [usersData, setUsersData] = useState<IUserData[]>([])
    const { toast } = useToast()
    const dispatch = useDispatch()
    //const addedUsers = useSelector((state: RootState) => state.users.addedUsers as IUserData[])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [sendingDelete, setSendingDelete] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number>(0)
    //const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const closeModalAddUser = useSelector((state: RootState) => state.users.closeModalAddUser)
    const closeModalEditUser = useSelector((state: RootState) => state.users.closeModalEditUser)
    const [selectedUsername, setSelectedUsername] = useState<string>("")
    const [loadingSignAs, setLoadingSignAs] = useState<boolean>(false)

    const { data: session } = useSession()

    // useEffect(() => {
    //     async function getUsersFn() {
    //         const { error, data, message } = await getUsers()

    //         if (error) {
    //             toast({
    //                 variant: "destructive",
    //                 title: "Usuarios || " + appName,
    //                 description: message,
    //                 duration: 5000
    //             })
    //         } else {
    //             setUsersData([...data])
    //         }
    //         setDataTableLoading(false)
    //     }
    //     getUsersFn()
    // }, [toast])

    // useEffect(() => {
    //     function getAddedRol() {
    //         // If a new rol added, update array for UI
    //         if (addedUsers.length > 0) {
    //             setUsersData((prevS) => {
    //                 const index = prevS.findIndex(item => item.id === addedUsers[0].id)

    //                 if (index !== -1) {
    //                     const updatedItems = [...prevS]

    //                     updatedItems[index] = addedUsers[0]
    //                     return updatedItems
    //                 } else {
    //                     return [addedUsers[0], ...prevS] as IUserData[]
    //                 }
    //             })
    //         }
    //     }
    //     getAddedRol()
    // }, [addedUsers])

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

        const { error, message } = await deleteUser(selectedUserId, userData)

        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar Usuario || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            // setUsersData((prevS) => {
            //     return prevS.map((user) => {
            //         return user.id === data.id ? { ...data, ...prevS } : user
            //     }
            //     )
            // })
            await revalidateFn('/users')
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

    const signInAs = async (uId: number) => {
        setLoadingSignAs(true)

        localStorage.setItem("@signAsFrom", JSON.stringify(session?.user))

        const userData = {
            to_user_id: uId,
            rol_name: String(session?.user.role_name),
            from_user_id: Number(session?.user.id),
            from_username: String(session?.user.username),
            username: "",
            password: "",
            impersonatedBy: String(session?.user.username)
        }

        const res = await signInServerFunc(userData);

        if (res) {
            window.location.replace("/dashboard")
        }

    }

    return (
        <div className="m-2">
            {
                !data ? <TableSkeleton /> :
                    <DataTable
                        data={data}
                        columns={usersColumns(openModalEditUser, openModalDeleteUser, signInAs, loadingSignAs)}
                        addBtn={
                            <Button variant="outline" className='bg-green-600 dark:bg-green-900' onClick={() => dispatch(setCloseModalAddUser(true))}>
                                <Icon name="Plus" className="mr-2 h-4 w-4 text-white" />
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
                        exportData={false}
                    />
            }

            <MyDialog
                title="Agregar Usuario"
                description=""
                content={<AddUserForm />}
                btnTrigger={<></>}
                myClassName="max-w-[85vw] h-full max-h-[75vh]"
                closeModal={closeModalAddUser}
                onOpenChange={() => dispatch(setCloseModalAddUser(!closeModalAddUser))}
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
                            sendingDelete && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
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
                title="Editar Usuario"
                description=""
                content={
                    <EditUserForm selectedUserId={selectedUserId} />
                }
                btnTrigger={<></>}
                myClassName="max-w-[85vw] h-full max-h-[75vh]"
                closeModal={closeModalEditUser}
                onOpenChange={() => dispatch(setCloseModalEditUser(!closeModalEditUser))}
            />
        </div>
    )
}