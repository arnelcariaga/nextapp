"use client"
import { useEffect, useState } from "react"
import { communityOperationUsersColumns } from "./communityOperationUsersColumns"
import DataTable from "../../MyDataTable/data-table"
import MyDialog from "../../MyDialog"
import { deleteCommunityOperationUser, getAllCommunityOperationUsers } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { Button } from "@/components/ui/button"
import { ICommunityOperationUsers } from "@/lib/interfaces"
import TableSkeleton from "../../MyDataTable/TableSkeleton"
import { useSession } from "next-auth/react"
import Icon from "../../Icon"
import { useRouter } from "next/navigation"

export default function UserList() {
    const [communityOperationUsersData, setCommunityOperationUsersData] = useState<ICommunityOperationUsers[]>([])
    const { toast } = useToast()
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [sendingDelete, setSendingDelete] = useState(false);
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const [selectedCommunityOperationUserId, setSelectedCommunityOperationUserId] = useState<number>()
    const { data: session } = useSession()
    const router = useRouter()
    const screen = session?.user.screens.find(screen => screen.path === '/community_operations');
    const [canDelete, setCanDelete] = useState<boolean>(false)

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
        async function getCommnutiOperationUsersFn() {
            if (session) {
                const { error, data, message } = await getAllCommunityOperationUsers(Number(session.user.id_sai), Number(session.user.id_role))

                if (error) {
                    toast({
                        variant: "destructive",
                        title: "Operativo Comunidad -> Usuarios || " + appName,
                        description: message,
                        duration: 5000
                    })
                } else {
                    setCommunityOperationUsersData(data)

                }
                setDataTableLoading(false)
            }
        }
        getCommnutiOperationUsersFn()
    }, [toast, session])


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

    return (
        <div className="w-full p-2">
            {
                dataTableLoading ? <TableSkeleton /> :
                    <DataTable
                        data={communityOperationUsersData}
                        columns={communityOperationUsersColumns(openModalDeleteCommunityOperationUser, canDelete)}
                        addBtn={<></>}
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
                title="Eliminar Usuario de Operativo Cominidad"
                description="¿Estas seguro que quieres eliminar este Usuario?"
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
        </div>
    )
}