"use client"
import { useEffect, useState } from "react"
import { communityOperationUsersColumns } from "./communityOperationUsersColumns"
import DataTable from "../../MyDataTable/data-table"
import MyDialog from "../../MyDialog"
import AddUserForm from "./AddUserForm"
import { deleteCommunityOperationUser } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { setCloseModalAddCommunityOperationUser, setCloseModalEditCommunityOperationUser } from "@/redux/slices/communityOperationUsersSlice"
import { ICommunityOperationUsersDataTable, ISession } from "@/lib/interfaces"
import EditCommunityOperationUserForm from "./EditCommunityOperationUserForm"
//import { useSession } from "next-auth/react"
import Icon from "../../Icon"
import { TCommunityOperativeUserParams } from "@/lib/types"
//import { useRouter } from "next/navigation"

interface IComponentProps {
    data: ICommunityOperationUsersDataTable[]
    params: TCommunityOperativeUserParams['params']
    session: ISession['session']
}

export default function Users({ data, params, session }: IComponentProps) {
    const [communityOperationUsersData, setCommunityOperationUsersData] = useState<ICommunityOperationUsersDataTable[]>([])
    const { toast } = useToast()
    const dispatch = useDispatch()
    //const addedCommunityOperationUser = useSelector((state: RootState) => state.communityOperationUsers.addedCommunityOperationUser as ICommunityOperationUsersDataTable[])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [sendingDelete, setSendingDelete] = useState(false);
    const [selectedCommunityOperationUserData, setSelectedCommunityOperationUserData] = useState<ICommunityOperationUsersDataTable>()
    //const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const [selectedCommunityOperationUserId, setSelectedCommunityOperationUserId] = useState<number>()
    const closeModalAddCommunityOperationUser = useSelector((state: RootState) => state.communityOperationUsers.closeModalAddCommunityOperationUser)
    const closeModalEditCommunityOperationUser = useSelector((state: RootState) => state.communityOperationUsers.closeModalEditCommunityOperationUser)
    //const { data: session } = useSession()
    //const router = useRouter()
    const screen = session?.user.screens.find(screen => screen.path === '/community_operations');
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);

    // Check user permission
    useEffect(() => {
        if (screen && screen.permissions.delete === '1') {
            setCanDelete(true)
        }
        if (screen && screen.permissions.edit === '1') {
            setCanEdit(true)
        }
    }, [screen]);

    // useEffect(() => {
    //     async function getCommnutiOperationUsersFn() {
    //         if (session?.user.id) {
    //             const { error, data, message } = String(session.user.id_role) === "1" ? await getCommunityOperationUsersByOperationId(Number(params.id)) : await getCommunityOperationUsersBySaiAndOerationId(Number(session?.user.id_sai), Number(params.id))

    //             if (error) {
    //                 toast({
    //                     variant: "destructive",
    //                     title: "Operativo Comunidad -> Usuarios || " + appName,
    //                     description: message,
    //                     duration: 5000
    //                 })
    //                 router.push("/not_found")
    //             } else {
    //                 if (String(session.user.id_role) === "1") {
    //                     setCommunityOperationUsersData([...data.community_operation_users])
    //                 } else {
    //                     setCommunityOperationUsersData([...data["community_operation_users"]])
    //                 }

    //             }
    //             setDataTableLoading(false)
    //         }
    //     }
    //     getCommnutiOperationUsersFn()
    // }, [toast, session?.user.id, params.id, session?.user.id_role, session?.user.id_sai, router])

    // useEffect(() => {
    //     function getAddedCommunityOperationUser() {
    //         // If a new Community Operation User added, update array for UI
    //         if (addedCommunityOperationUser.length > 0) {
    //             setCommunityOperationUsersData((prevS) => {
    //                 const index = prevS.findIndex(item => item.id === addedCommunityOperationUser[0].id)

    //                 if (index !== -1) {
    //                     const updatedItems = [...prevS]

    //                     updatedItems[index] = addedCommunityOperationUser[0]
    //                     return updatedItems
    //                 } else {
    //                     return [addedCommunityOperationUser[0], ...prevS] as ICommunityOperationUsersDataTable[]
    //                 }
    //             })
    //         }
    //     }
    //     getAddedCommunityOperationUser()
    // }, [addedCommunityOperationUser])

    // For deleting Community Operation User
    const openModalDeleteCommunityOperationUser = (communityOperationUserId: number) => {
        setOpenDeleteModal(true)
        setSelectedCommunityOperationUserId(communityOperationUserId)
    }

    const deleteCommunityOperationUserFn = async () => {
        setSendingDelete(true)

        const communityOperationUserData = [{
            community_operation_user_id: selectedCommunityOperationUserId,
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username,
        }]

        const { error, data, message } = await deleteCommunityOperationUser(communityOperationUserData)

        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar Usuario De Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            const newCommunityOperationUserData = communityOperationUsersData.filter((item) => item.id !== selectedCommunityOperationUserId)
            setCommunityOperationUsersData(newCommunityOperationUserData)
            setOpenDeleteModal(false)
            toast({
                title: "Eliminar Usuario De Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingDelete(false)
    }

    // For editing Community Operation User
    const openModalEditCommunityOperationUser = async (data: ICommunityOperationUsersDataTable) => {
        dispatch(setCloseModalEditCommunityOperationUser(true))
        setSelectedCommunityOperationUserData(data)
    }

    return (
        <div className="w-full p-2">
            <DataTable
                data={data}
                columns={communityOperationUsersColumns(openModalEditCommunityOperationUser, openModalDeleteCommunityOperationUser, canDelete, canEdit)}
                addBtn={
                    screen?.permissions.create === "0" ? <></> :
                        <Button variant="outline" className='bg-green-600 dark:bg-green-900' onClick={() => dispatch(setCloseModalAddCommunityOperationUser(true))}>
                            <Icon name="Plus" className="mr-2 h-4 w-4 text-white" />
                            <span className='text-white'>
                                Agregar Usuario
                            </span>
                        </Button>
                }
                columnBtnFilter
                columnHidden={{}}
                orderByObj={{
                    id: 'created_at',
                    desc: true
                }}
                exportData={false}
            />

            <MyDialog
                title="Operartivo Comunidad -> Agregar Usuario"
                description=""
                content={<AddUserForm params={params} />}
                btnTrigger={<></>}
                myClassName="max-w-[100vw] h-full max-h-[100vh]"
                closeModal={closeModalAddCommunityOperationUser}
                onOpenChange={() => dispatch(setCloseModalAddCommunityOperationUser(!closeModalAddCommunityOperationUser))}
            />

            <MyDialog
                title="Eliminar Usuario de Operativo Cominidad"
                description="¿Estas seguro que quieres eliminar este Usuario De este Operativo Cominidad?"
                content={
                    <Button
                        variant="destructive"
                        className="border-red-500 float-end self-end"
                        disabled={sendingDelete}
                        onClick={deleteCommunityOperationUserFn}>
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
                title="Operartivo Comunidad -> Editar Usuario"
                description=""
                content={
                    <EditCommunityOperationUserForm selectedItem={selectedCommunityOperationUserData} />
                }
                btnTrigger={<></>}
                myClassName="max-w-[100vw] h-full max-h-[100vh]"
                closeModal={closeModalEditCommunityOperationUser}
                onOpenChange={() => dispatch(setCloseModalEditCommunityOperationUser(!closeModalEditCommunityOperationUser))}
            />
        </div>
    )
}