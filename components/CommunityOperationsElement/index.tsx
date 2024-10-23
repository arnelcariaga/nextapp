"use client"
import { useEffect, useState } from "react"
import { communityOperationsColumns } from "./communityOperationsColumns"
import DataTable from "../MyDataTable/data-table"
import MyDialog from "../MyDialog"
import { deleteCommunityOperation, getCommunityOperationsBySai, getCommunityOperations } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { Button } from "@/components/ui/button"
import { ICommunityOperationDataTable } from "@/lib/interfaces"
import EditCommunityOperationForm from "./EditCommunityOperationForm"
import TableSkeleton from "../MyDataTable/TableSkeleton"
import { useSession } from "next-auth/react"
import Icon from "../Icon"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { setCloseModalEditCommunityOperation } from "@/redux/slices/communityOperationsSlice"
import { useRouter } from "next/navigation"

export default function CommunityOperationsElement() {
    const [communityOperationsData, setCommunityOperationsData] = useState<ICommunityOperationDataTable[]>([])
    const { toast } = useToast()
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [sendingDelete, setSendingDelete] = useState<boolean>(false);
    const [selectedCommunityOperation, setSelectedCommunityOperation] = useState<ICommunityOperationDataTable>()
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const { data: session } = useSession()
    const closeModalEditCommunityOperation = useSelector((state: RootState) => state.communityOperations.closeModalEditCommunityOperation)
    const addedCommunityOperation = useSelector((state: RootState) => state.communityOperations.addedCommunityOperation as ICommunityOperationDataTable[])
    const [selectedCommunityOperationId, setSelectedCommunityOperationId] = useState<number>(0);
    const dispatch = useDispatch()
    const router = useRouter()
    const screen = session?.user.screens.find(screen => screen.path === '/community_operations');
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);

    useEffect(() => {
        // Buscar los permisos del usuario para esta pantalla
        if (screen && screen.permissions.view === '0') {
            router.push("/not-found")
        }
    }, [screen, router]);

    useEffect(() => {
        // Buscar los permisos del usuario para esta pantalla
        if (screen && screen.permissions.delete === '1') {
            setCanDelete(true)
        }
    }, [screen]);

    useEffect(() => {
        // Buscar los permisos del usuario para esta pantalla
        if (screen && screen.permissions.edit === '1') {
            setCanEdit(true)
        }
    }, [screen]);

    useEffect(() => {
        function getAddedCommunityOperation() {
            // If a new community operation added, update array for UI
            if (addedCommunityOperation.length > 0) {
                setCommunityOperationsData((prevS) => {
                    const index = prevS.findIndex(item => item.id === addedCommunityOperation[0].id)

                    if (index !== -1) {
                        const updatedItems = [...prevS]

                        updatedItems[index] = addedCommunityOperation[0]
                        return updatedItems
                    } else {
                        return [addedCommunityOperation[0], ...prevS] as ICommunityOperationDataTable[]
                    }
                })
            }
        }
        getAddedCommunityOperation()
    }, [addedCommunityOperation])

    useEffect(() => {
        async function getCommunityOperationsBySaiFn() {
            if (session) {
                const { error, data, message } = String(session.user.id_role) === "1" ? await getCommunityOperations() : await getCommunityOperationsBySai(Number(session?.user.id_sai))

                if (error) {
                    toast({
                        variant: "destructive",
                        title: "Operativo Comunidad || " + appName,
                        description: message,
                        duration: 5000
                    })
                } else {
                    String(session.user.id_role) === "1"
                        ?
                        setCommunityOperationsData([...data])
                        :
                        setCommunityOperationsData([...data[0]["community_operations"]])
                }
                setDataTableLoading(false)
            }
        }
        getCommunityOperationsBySaiFn()
    }, [toast, session])

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

        const { error, data, message } = await deleteCommunityOperation(communityOperationData)

        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            const newCommunityOperationData = communityOperationsData.filter((item) => item.id !== selectedCommunityOperationId)
            setCommunityOperationsData(newCommunityOperationData)
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
            {
                dataTableLoading ? <TableSkeleton /> :
                    <DataTable
                        data={communityOperationsData}
                        columns={communityOperationsColumns(openModalEditCommunityOperation, openModalDeleteCommunityOperation, canDelete, canEdit)}
                        addBtn={
                            screen?.permissions.create === "0" ? <></> :
                                <Button variant="outline" className='bg-green-600 dark:bg-green-900' asChild>
                                    <Link href="/community_operations/add">
                                        <Icon name="Plus" className="mr-2 h-4 w-4 text-white" />
                                        <span className='text-white'>
                                            Agregar Operativo
                                        </span>
                                    </Link>

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
            }

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