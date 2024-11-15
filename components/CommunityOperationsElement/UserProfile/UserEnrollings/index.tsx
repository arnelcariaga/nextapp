"use client"
import { useEffect, useState } from "react"
import { communityOperationUserEnrollingColumns } from "./communityOperationUserEnrollingColumns"
import DataTable from "@/components/MyDataTable/data-table"
import MyDialog from "@/components/MyDialog"
import { deleteCommunityOperationUserEnrolling } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
// import { useSelector } from "react-redux"
// import { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { ICommunityOperationUserDetails, ISession, IUserCommunityUserEnrolling } from "@/lib/interfaces"
import EditEnrollingForm from "./EditEnrollingForm"
//import { useSession } from "next-auth/react"
import Icon from "@/components/Icon"
import { TCommunityOperativeUserParams } from "@/lib/types"
//import { useRouter } from "next/navigation"
import UserDetailsHeader from "../UserDetailsHeader"
//import CommunityOperationUserTrackingsSkeleton from "@/components/CommunityOperationUserTrackingsSkeleton"
import AddEnrollingForm from "../AddEnrollingForm"
import { revalidateFn } from "../../../../lib/revalidateActions"

interface IComponentProps {
    params: TCommunityOperativeUserParams['params']
    data: ICommunityOperationUserDetails
    communityOperationUserEnrollingsData: IUserCommunityUserEnrolling[]
    session: ISession['session']
}

export default function UserEnrollings({ params, data, communityOperationUserEnrollingsData, session }: IComponentProps) {
    //const [communityOperationUserEnrollingsData, setCommunityOperationUserEnrollingsData] = useState<IUserCommunityUserEnrolling[]>([])
    const { toast } = useToast()
    //const addedCommunityOperationUserEnrolling = useSelector((state: RootState) => state.communityOperationUsers.addedCommunityOperationUserEnrolling as IUserCommunityUserEnrolling[])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [sendingDelete, setSendingDelete] = useState(false);
    const [selectedCommunityOperationUserEnrollingData, setSelectedCommunityOperationUserEnrollingData] = useState<IUserCommunityUserEnrolling[]>([])
    //const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const [selectedCommunityOperationUserEnrollingId, setSelectedCommunityOperationUserEnrollingId] = useState<number>()
    //const { data: session } = useSession()
    //const router = useRouter()
    const screen = session?.user.screens.find(screen => screen.path === '/community_operations');
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    //const [userDetails, setUserDetails] = useState<ICommunityOperationUserDetails>()
    const [openAddEnrollingForm, setOpenAddEnrollingForm] = useState<boolean>(false)
    const [openEditEnrollingForm, setOpenEditEnrollingForm] = useState<boolean>(false)
    const [sendingSave, setSendingSave] = useState<boolean>(false)

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
    // useEffect(() => {
    //     async function getCommnutiOperationUsersFn() {
    //         if (session) {
    //             const { error, data, message } = await getCommunityOperationUserDetails(Number(session?.user.id_sai), Number(session?.user.id_role), params.id)

    //             if (error) {
    //                 toast({
    //                     variant: "destructive",
    //                     title: "Operativo Comunidad -> Perfil Usuario || " + appName,
    //                     description: message,
    //                     duration: 5000
    //                 })
    //                 router.push("/not_found")
    //             } else {
    //                 setUserDetails(data)

    //             }
    //             setDataTableLoading(false)
    //         }
    //     }
    //     getCommnutiOperationUsersFn()
    // }, [toast, session, params, router])

    // Get user enrollings
    // useEffect(() => {
    //     async function getCommnutiOperationUserEnrollingsByIdFn() {
    //         if (session?.user.id) {
    //             const { error, data, message } = await getCommunityOperationUserEnrollingsById(Number(params.id))

    //             if (error) {
    //                 toast({
    //                     variant: "destructive",
    //                     title: "Operativo Comunidad -> Situación de enrolamiento del usuario || " + appName,
    //                     description: message,
    //                     duration: 5000
    //                 })
    //             } else {
    //                 setCommunityOperationUserEnrollingsData(data)
    //             }
    //             setDataTableLoading(false)
    //         }
    //     }
    //     getCommnutiOperationUserEnrollingsByIdFn()
    // }, [toast, session?.user.id, params.id, router])

    // useEffect(() => {
    //     function getAddedCommunityOperationUserEnrolling() {
    //         // If a new Community Operation User enrolling added, update array for UI
    //         if (addedCommunityOperationUserEnrolling.length > 0) {
    //             setCommunityOperationUserEnrollingsData((prevS) => {
    //                 const index = prevS.findIndex(item => item.id === addedCommunityOperationUserEnrolling[0].id)

    //                 if (index !== -1) {
    //                     const updatedItems = [...prevS]

    //                     updatedItems[index] = addedCommunityOperationUserEnrolling[0]
    //                     return updatedItems
    //                 } else {
    //                     return [addedCommunityOperationUserEnrolling[0], ...prevS] as IUserCommunityUserEnrolling[]
    //                 }
    //             })
    //         }
    //     }
    //     getAddedCommunityOperationUserEnrolling()
    // }, [addedCommunityOperationUserEnrolling])


    // For deleting Community Operation User enrolling
    const openModalDeleteCommunityOperationUserEnrolling = (communityOperationUserEnrollingId: number) => {
        setOpenDeleteModal(true)
        setSelectedCommunityOperationUserEnrollingId(communityOperationUserEnrollingId)
    }

    const deleteCommunityOperationUserEnrollingFn = async () => {
        setSendingDelete(true)

        const communityOperationUserEnrollingData = [{
            community_operation_user_id: params.id,
            community_operation_user_enrolling_id: selectedCommunityOperationUserEnrollingId,
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username,
        }]

        const { error, data, message } = await deleteCommunityOperationUserEnrolling(communityOperationUserEnrollingData)

        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar situación de enrolamiento del usuario || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            // const newCommunityOperationUserEnrollingData = communityOperationUserEnrollingsData.filter((item) => item.id !== selectedCommunityOperationUserEnrollingId)
            // setCommunityOperationUserEnrollingsData(newCommunityOperationUserEnrollingData)
            await revalidateFn(`/community_operations/${params.id}/user_profile/enrollings`)
            setOpenDeleteModal(false)
            toast({
                title: "Eliminar situación de enrolamiento del usuario || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingDelete(false)
    }

    // For editing Community Operation User enrolling
    const openModalEditCommunityOperationUserEnrolling = async (data: IUserCommunityUserEnrolling[]) => {
        setOpenEditEnrollingForm(true)
        setSelectedCommunityOperationUserEnrollingData(data)
    }

    return (
        <div className="w-full p-2">
            <UserDetailsHeader showDescription={false} userDetails={data as ICommunityOperationUserDetails} canEdit={false} />
            <div className="mt-2">
                <DataTable
                    data={communityOperationUserEnrollingsData}
                    columns={communityOperationUserEnrollingColumns(openModalEditCommunityOperationUserEnrolling, openModalDeleteCommunityOperationUserEnrolling, canDelete, canEdit)}
                    addBtn={
                        sendingSave ? <></> : screen?.permissions.create === "0" ? <></> :
                            communityOperationUserEnrollingsData.length === 0 ?
                                <Button variant="outline" className='bg-green-600 dark:bg-green-900' onClick={() => setOpenAddEnrollingForm(true)}>
                                    <Icon name="Plus" className="mr-2 h-4 w-4 text-white" />
                                    <span className='text-white'>
                                        Nuevo situaci&oacute;n enrolamiento
                                    </span>
                                </Button> : <></>
                    }
                    columnBtnFilter
                    columnHidden={{}}
                    orderByObj={{
                        id: 'enrolling_date',
                        desc: true
                    }}
                    exportData={false}
                />
            </div>

            <MyDialog
                title="Paciente Operartivo Comunidad -> Agregar situación de enrolamiento"
                description=""
                content={<AddEnrollingForm
                    params={params}
                    userName={data?.name + " " + data?.last_name}
                    //setCountEnrolling={() => { }}
                    setOpenAddEnrollingForm={(val) => {
                        setSendingSave(true)
                        setOpenAddEnrollingForm(val)
                    }}
                />}
                btnTrigger={<></>}
                myClassName="md:w-[50vw] w-[100vw] h-full max-h-[65vh]"
                closeModal={openAddEnrollingForm}
                onOpenChange={() => setOpenAddEnrollingForm(!openAddEnrollingForm)}
            />

            <MyDialog
                title="Eliminar situación de enrolamiento del usuario"
                description="¿Estas seguro que quieres eliminar el situación de enrolamiento de este usuario?"
                content={
                    <Button
                        variant="destructive"
                        className="border-red-500 float-end self-end"
                        disabled={sendingDelete}
                        onClick={deleteCommunityOperationUserEnrollingFn}>
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
                title="Paciente Operartivo Comunidad -> Editar situación de enrolamiento"
                description=""
                content={
                    <EditEnrollingForm
                        selectedItem={selectedCommunityOperationUserEnrollingData}
                        setOpenEditEnrollingForm={setOpenEditEnrollingForm}
                        params={params}
                        userName={data?.name + " " + data?.last_name}
                    />
                }
                btnTrigger={<></>}
                myClassName="md:w-[50vw] w-[100vw] h-full max-h-[65vh]"
                closeModal={openEditEnrollingForm}
                onOpenChange={() => setOpenEditEnrollingForm(!openEditEnrollingForm)}
            />
        </div>
    )
}