"use client"
import { useEffect, useState } from "react"
import { communityOperationsColumns } from "./communityOperationsColumns"
import DataTable from "../MyDataTable/data-table"
import MyDialog from "../MyDialog"
import { deleteCommunityOperation } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { Button } from "@/components/ui/button"
import { ICommunityOperationDataTable, ISession } from "@/lib/interfaces"
import EditCommunityOperationForm from "./EditCommunityOperationForm"
//import TableSkeleton from "../TableSkeleton"
//import { useSession } from "next-auth/react"
import Icon from "../Icon"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { setCloseModalEditCommunityOperation } from "@/redux/slices/communityOperationsSlice"
import { revalidateFn } from "../../lib/revalidateActions"

interface IComponentProps {
    data: ICommunityOperationDataTable[]
    session: ISession['session']
}

export default function CommunityOperationsElement({ data, session }: IComponentProps) {
    //const [communityOperationsData, setCommunityOperationsData] = useState<ICommunityOperationDataTable[]>([])
    const { toast } = useToast()
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [sendingDelete, setSendingDelete] = useState<boolean>(false);
    const [selectedCommunityOperation, setSelectedCommunityOperation] = useState<ICommunityOperationDataTable>()
    //const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    //const { data: session } = useSession()
    const closeModalEditCommunityOperation = useSelector((state: RootState) => state.communityOperations.closeModalEditCommunityOperation)
    //const addedCommunityOperation = useSelector((state: RootState) => state.communityOperations.addedCommunityOperation as ICommunityOperationDataTable[])
    const [selectedCommunityOperationId, setSelectedCommunityOperationId] = useState<number>(0);
    const dispatch = useDispatch()
    const screen = session?.user.screens.find(screen => screen.path === '/community_operations');
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [canCreate, setCanCreate] = useState<boolean>(false);

    // Check user permissions
    useEffect(() => {
        if (screen && screen.permissions.delete === '1') {
            setCanDelete(true)
        }

        if (screen && screen.permissions.edit === '1') {
            setCanEdit(true)
        }

        if (screen && screen.permissions.create === '1') {
            setCanCreate(true)
        }
    }, [screen]);

    // useEffect(() => {
    //     function getAddedCommunityOperation() {
    //         // If a new community operation added, update array for UI
    //         if (addedCommunityOperation.length > 0) {
    //             setCommunityOperationsData((prevS) => {
    //                 const index = prevS.findIndex(item => item.id === addedCommunityOperation[0].id)

    //                 if (index !== -1) {
    //                     const updatedItems = [...prevS]

    //                     updatedItems[index] = addedCommunityOperation[0]
    //                     return updatedItems
    //                 } else {
    //                     return [addedCommunityOperation[0], ...prevS] as ICommunityOperationDataTable[]
    //                 }
    //             })
    //         }
    //     }
    //     getAddedCommunityOperation()
    // }, [addedCommunityOperation])

    // useEffect(() => {
    //     async function getCommunityOperationsBySaiFn() {
    //         if (session) {
    //             const { error, data, message } = String(session.user.id_role) === "1" ? await getCommunityOperations() : await getCommunityOperationsBySai(Number(session?.user.id_sai))

    //             if (error) {
    //                 toast({
    //                     variant: "destructive",
    //                     title: "Operativo Comunidad || " + appName,
    //                     description: message,
    //                     duration: 5000
    //                 })
    //             } else {
    //                 String(session.user.id_role) === "1"
    //                     ?
    //                     setCommunityOperationsData([...data])
    //                     :
    //                     setCommunityOperationsData([...data[0]["community_operations"]])
    //             }
    //             setDataTableLoading(false)
    //         }
    //     }
    //     getCommunityOperationsBySaiFn()
    // }, [toast, session])

    // For deleting Community Operation

    const openModalDeleteCommunityOperation = (communityOperationId: number) => {
        setOpenDeleteModal(true)
        setSelectedCommunityOperationId(communityOperationId)
    }

    const deleteCommunityOperationFn = async () => {
        setSendingDelete(true)

        const communityOperationData = [{
            community_operation_id: selectedCommunityOperationId,
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username,
        }]

        const { error, message } = await deleteCommunityOperation(communityOperationData)

        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            // const newCommunityOperationData = communityOperationsData.filter((item) => item.id !== selectedCommunityOperationId)
            // setCommunityOperationsData(newCommunityOperationData)
            await revalidateFn('/community_operations')
            setOpenDeleteModal(false)
            toast({
                title: "Eliminar Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingDelete(false)
    }

    // For editing Community Operation
    const openModalEditCommunityOperation = (data: ICommunityOperationDataTable) => {
        setSelectedCommunityOperation(data)
        dispatch(setCloseModalEditCommunityOperation(true))
    }

    return (
        <div className="w-full p-2">
            <DataTable
                data={data}
                columns={communityOperationsColumns(openModalEditCommunityOperation, openModalDeleteCommunityOperation, canDelete, canEdit)}
                addBtn={
                    canCreate ? <Button variant="outline" className='bg-green-600 dark:bg-green-900' asChild>
                        <Link href="/community_operations/add">
                            <Icon name="Plus" className="mr-2 h-4 w-4 text-white" />
                            <span className='text-white'>
                                Agregar Operativo
                            </span>
                        </Link>
                    </Button> : <></>
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
                title="Eliminar Operativo Comunidad"
                description="¿Estas seguro que quieres eliminar este Operativo Comunidad? También se eliminarán sus usuarios"
                content={
                    <Button
                        variant="destructive"
                        className="border-red-500 float-end self-end"
                        disabled={sendingDelete}
                        onClick={deleteCommunityOperationFn}>
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
                title="Editar Operativo Comunidad"
                description=""
                content={
                    <EditCommunityOperationForm selectedItem={selectedCommunityOperation} />
                }
                btnTrigger={<></>}
                myClassName="max-w-[85vw] h-full max-h-[60vh]"
                closeModal={closeModalEditCommunityOperation}
                onOpenChange={() => dispatch(setCloseModalEditCommunityOperation(!closeModalEditCommunityOperation))}
            />
        </div>
    )
}