"use client"
import { useEffect, useState } from "react"
import { saisColumns } from "./saisColumns"
import DataTable from "../MyDataTable/data-table"
import MyDialog from "../MyDialog"
import AddSaiForm from "./AddForm"
import { getSais, deleteSai } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { setCloseModalAddSai, setCloseModalEditSai } from "@/redux/slices/saisSlice"
import { ISai } from "@/lib/interfaces"
import EditSaiForm from "./EditSaiForm"
import TableSkeleton from "../TableSkeleton"
import { useSession } from "next-auth/react"
import Icon from "../Icon"

export default function ParticipantInscriptionFormElement() {
    const [saisData, setSaisData] = useState<ISai[]>([])
    const { toast } = useToast()
    const dispatch = useDispatch()
    //const addedSais = useSelector((state: RootState) => state.sais.addedSais as ISai[])
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [sendingDelete, setSendingDelete] = useState(false);
    const [selectedSaiId, setSelectedSaiId] = useState<number>(0)
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const closeModalAddSai = useSelector((state: RootState) => state.sais.closeModalAddSai)
    const closeModalEditSai = useSelector((state: RootState) => state.sais.closeModalEditSai)
    const { data: session } = useSession()

    // Load SAIs
    useEffect(() => {
        async function getSAIsFn() {
            if (session?.user.token) {
                try {
                    const data = await getSais(session?.user.token)
                    setSaisData(data)
                } catch (error: any) {
                    toast({
                        variant: "destructive",
                        title: "Agregar Usuario || " + appName,
                        description: error,
                        duration: 5000
                    })
                }
            }
        }
        getSAIsFn()
    }, [toast, session?.user.token])

    // useEffect(() => {
    //     function getAddedSai() {
    //         // If a new SAI added, update array for UI
    //         if (addedSais.length > 0) {
    //             setSaisData((prevS) => {
    //                 const index = prevS.findIndex(item => item.id === addedSais[0].id)

    //                 if (index !== -1) {
    //                     const updatedItems = [...prevS]

    //                     updatedItems[index] = addedSais[0]
    //                     return updatedItems
    //                 } else {
    //                     return [addedSais[0], ...prevS] as ISai[]
    //                 }
    //             })
    //         }
    //     }
    //     getAddedSai()
    // }, [addedSais])

    // For deleting SAI
    
    const openModalDeleteSai = (saiId: number) => {
        setOpenDeleteModal(true)
        setSelectedSaiId(saiId)
    }

    const deleteSaiFn = async () => {
        setSendingDelete(true)

        const saiData = [{
            sai_id: selectedSaiId,
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username,
        }]

        const { error, data, message } = await deleteSai(saiData)

        if (error) {
            toast({
                variant: "destructive",
                title: "Eliminar Usuario || " + appName,
                description: message,
                duration: 5000
            })
        } else {

            if (data.action === "deleted") {
                setSaisData((prevS) => {
                    return prevS.filter((sai) => {
                        return sai.id !== data.data.id
                    }
                    )
                })

            } else {
                setSaisData((prevS) => {
                    return prevS.map((sai) => {
                        return sai.id === data.id ? { ...data, ...prevS } : sai
                    }
                    )
                })

            }

            setOpenDeleteModal(false)
            toast({
                title: "Eliminar Usuario || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingDelete(false)
    }

    // For editing SAI
    const openModalEditSai = async (saiId: number) => {
        dispatch(setCloseModalEditSai(true))
        setSelectedSaiId(saiId)
    }

    return (
        <div className="w-full p-2">
            {
                dataTableLoading ? <TableSkeleton /> :
                    <DataTable
                        data={saisData}
                        columns={saisColumns(openModalEditSai, openModalDeleteSai)}
                        addBtn={
                            <Button variant="outline" className='bg-green-600 dark:bg-green-900' onClick={() => dispatch(setCloseModalAddSai(true))}>
                                <Icon name="Plus" className="mr-2 h-4 w-4 text-white" />
                                <span className='text-white'>
                                    Agregar SAIs
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
            }

            <MyDialog
                title="Agregar SAI"
                description=""
                content={<AddSaiForm />}
                btnTrigger={<></>}
                myClassName="max-w-[85vw] h-full max-h-[85vh]"
                closeModal={closeModalAddSai}
                onOpenChange={() => dispatch(setCloseModalAddSai(!closeModalAddSai))}
            />

            <MyDialog
                title="Eliminar SAI"
                description="¿Estas seguro que quieres eliminar este SAI?"
                content={
                    <Button
                        variant="destructive"
                        className="border-red-500 float-end self-end"
                        disabled={sendingDelete}
                        onClick={deleteSaiFn}>
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
                title="Editar SAI"
                description=""
                content={
                    <EditSaiForm selectedSaiId={selectedSaiId} />
                }
                btnTrigger={<></>}
                myClassName="max-w-[85vw] h-full max-h-[85vh]"
                closeModal={closeModalEditSai}
                onOpenChange={() => dispatch(setCloseModalEditSai(!closeModalEditSai))}
            />
        </div>
    )
}