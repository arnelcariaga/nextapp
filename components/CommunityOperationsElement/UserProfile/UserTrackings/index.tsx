"use client"
import { useEffect, useState } from "react"
import { communityOperationUsersColumns } from "./communityOperationUsersColumns"
import DataTable from "@/components/MyDataTable/data-table"
import MyDialog from "@/components/MyDialog"
import { deleteCommunityOperationUserTracking, getCommunityOperationUserTrackingsById, getCommunityOperationUserDetails } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { ICommunityOperationUserDetails, IUserCommunityUserTracking } from "@/lib/interfaces"
import EditTrackingForm from "./EditTrackingForm"
import TableSkeleton from "@/components/MyDataTable/TableSkeleton"
import { useSession } from "next-auth/react"
import Icon from "@/components/Icon"
import { TCommunityOperativeUserParams } from "@/lib/types"
import { useRouter } from "next/navigation"
import UserDetailsHeader from "../UserDetailsHeader"
import CommunityOperationUserTrackingsSkeleton from "@/components/CommunityOperationUserTrackingsSkeleton"
import AddTrackingForm from "../AddTrackingForm"

export default function UserTrackings({ params }: TCommunityOperativeUserParams) {
    const [communityOperationUserTrackingsData, setCommunityOperationUserTrackingsData] = useState<IUserCommunityUserTracking[]>([])
    const { toast } = useToast()
    const addedCommunityOperationUserTracking = useSelector((state: RootState) => state.communityOperationUsers.addedCommunityOperationUserTracking as IUserCommunityUserTracking[])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [sendingDelete, setSendingDelete] = useState(false);
    const [selectedCommunityOperationUserTrackingData, setSelectedCommunityOperationUserTrackingData] = useState<IUserCommunityUserTracking[]>([])
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const [selectedCommunityOperationUserTrackingId, setSelectedCommunityOperationUserTrackingId] = useState<number>()
    const { data: session } = useSession()
    const router = useRouter()
    const screen = session?.user.screens.find(screen => screen.path === '/community_operations');
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<ICommunityOperationUserDetails>()
    const [openAddTrackingForm, setOpenAddTrackingForm] = useState<boolean>(false)
    const [openEditTrackingForm, setOpenEditTrackingForm] = useState<boolean>(false)

    // Check user permission
    useEffect(() => {
        if (screen && screen.permissions.delete === '1') {
            setCanDelete(true)
        }
        if (screen && screen.permissions.edit === '1') {
            setCanEdit(true)
        }
    }, [screen]);

    // Get User details
    useEffect(() => {
        async function getCommnutiOperationUsersFn() {
            if (session) {
                const { error, data, message } = await getCommunityOperationUserDetails(Number(session?.user.id_sai), Number(session?.user.id_role), params.id)

                if (error) {
                    toast({
                        variant: "destructive",
                        title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                        description: message,
                        duration: 5000
                    })
                    router.push("/not_found")
                } else {
                    setUserDetails(data)

                }
                setDataTableLoading(false)
            }
        }
        getCommnutiOperationUsersFn()
    }, [toast, session, params, router])

    // Get user trackings
    useEffect(() => {
        async function getCommnutiOperationUserTrackingsByIdFn() {
            if (session?.user.id) {
                const { error, data, message } = await getCommunityOperationUserTrackingsById(Number(params.id))

                if (error) {
                    toast({
                        variant: "destructive",
                        title: "Operativo Comunidad -> Seguimientos del usuario || " + appName,
                        description: message,
                        duration: 5000
                    })
                } else {
                    setCommunityOperationUserTrackingsData(data)
                }
                setDataTableLoading(false)
            }
        }
        getCommnutiOperationUserTrackingsByIdFn()
    }, [toast, session?.user.id, params.id, router])

    useEffect(() => {
        function getAddedCommunityOperationUserTracking() {
            // If a new Community Operation User tracking added, update array for UI
            if (addedCommunityOperationUserTracking.length > 0) {
                setCommunityOperationUserTrackingsData((prevS) => {
                    const index = prevS.findIndex(item => item.id === addedCommunityOperationUserTracking[0].id)

                    if (index !== -1) {
                        const updatedItems = [...prevS]

                        updatedItems[index] = addedCommunityOperationUserTracking[0]
                        return updatedItems
                    } else {
                        return [addedCommunityOperationUserTracking[0], ...prevS] as IUserCommunityUserTracking[]
                    }
                })
            }
        }
        getAddedCommunityOperationUserTracking()
    }, [addedCommunityOperationUserTracking])

    // For deleting Community Operation User
    const openModalDeleteCommunityOperationUserTracking = (communityOperationUserTrackingId: number) => {
        setOpenDeleteModal(true)
        setSelectedCommunityOperationUserTrackingId(communityOperationUserTrackingId)
    }

    const deleteCommunityOperationUserFn = async () => {
        setSendingDelete(true)

        const communityOperationUserTrackingData = [{
            community_operation_user_id: params.id,
            community_operation_user_tracking_id: selectedCommunityOperationUserTrackingId,
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username,
        }]

        const { error, data, message } = await deleteCommunityOperationUserTracking(communityOperationUserTrackingData)

        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar seguimiento del usuario || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            const newCommunityOperationUserTrackingData = communityOperationUserTrackingsData.filter((item) => item.id !== selectedCommunityOperationUserTrackingId)
            setCommunityOperationUserTrackingsData(newCommunityOperationUserTrackingData)
            setOpenDeleteModal(false)
            toast({
                title: "Eliminar seguimiento del usuario || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingDelete(false)
    }

    // For editing Community Operation User
    const openModalEditCommunityOperationUser = async (data: IUserCommunityUserTracking[]) => {
        setOpenEditTrackingForm(true)
        setSelectedCommunityOperationUserTrackingData(data)
    }

    if (userDetails === undefined) {
        return <CommunityOperationUserTrackingsSkeleton />
    }
    return (
        <div className="w-full p-2">
            <UserDetailsHeader showDescription={false} userDetails={userDetails as ICommunityOperationUserDetails} canEdit={false} />
            {
                dataTableLoading ? <TableSkeleton /> :
                    <DataTable
                        data={communityOperationUserTrackingsData}
                        columns={communityOperationUsersColumns(openModalEditCommunityOperationUser, openModalDeleteCommunityOperationUserTracking, canDelete, canEdit)}
                        addBtn={
                            screen?.permissions.create === "0" ? <></> :
                                <Button variant="outline" className='bg-green-600 dark:bg-green-900' onClick={() => setOpenAddTrackingForm(true)}>
                                    <Icon name="Plus" className="mr-2 h-4 w-4 text-white" />
                                    <span className='text-white'>
                                        Nuevo seguimiento
                                    </span>
                                </Button>
                        }
                        columnBtnFilter
                        columnHidden={{}}
                        orderByObj={{
                            id: 'date',
                            desc: true
                        }}
                        exportData={false}
                    />
            }

            <MyDialog
                title="Paciente Operartivo Comunidad -> Agregar seguimiento"
                description=""
                content={<AddTrackingForm
                    params={params}
                    userName={userDetails?.name + " " + userDetails?.last_name}
                    setCountTracking={() => { }}
                    setOpenAddTrackingForm={setOpenAddTrackingForm}
                />}
                btnTrigger={<></>}
                myClassName="md:w-[50vw] w-[100vw] h-full max-h-[65vh]"
                closeModal={openAddTrackingForm}
                onOpenChange={() => setOpenAddTrackingForm(!openAddTrackingForm)}
            />

            <MyDialog
                title="Eliminar seguimiento del usuario"
                description="¿Estas seguro que quieres eliminar el seguimiento de este usuario?"
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
                title="Paciente Operartivo Comunidad -> Editar seguimiento"
                description=""
                content={
                    <EditTrackingForm
                        selectedItem={selectedCommunityOperationUserTrackingData}
                        setOpenEditTrackingForm={setOpenEditTrackingForm}
                        params={params}
                        userName={userDetails?.name + " " + userDetails?.last_name}
                    />
                }
                btnTrigger={<></>}
                myClassName="md:w-[50vw] w-[100vw] h-full max-h-[65vh]"
                closeModal={openEditTrackingForm}
                onOpenChange={() => setOpenEditTrackingForm(!openEditTrackingForm)}
            />
        </div>
    )
}