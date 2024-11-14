"use client"
import { useState } from "react"
import { auditLogsColumns } from "./auditLogsColumns"
import DataTable from "../MyDataTable/data-table"
import MyDialog from "../MyDialog"
import { IAuditLogs } from "@/lib/interfaces"
import TableSkeleton from "../TableSkeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "../ui/label"
import {
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import Icon from "../Icon"
import { revalidateFn } from "../CommunityOperationsElement/revalidateActions"

interface IComponentProps {
    data: IAuditLogs[]
}

export default function AuditLogsElement({ data }: IComponentProps) {
    //const [auditLogs, setAuditLogsData] = useState<IAuditLogs[]>([])
    const [selectedAuditLogs, setSelectedAuditLogs] = useState<IAuditLogs[]>([])
    //const { toast } = useToast()
    const [openMoreInfoModal, setOpenMoreInfoModal] = useState(false)
    const [refreshingData, setRefreshingData] = useState(false)
    //const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)

    const openModalMoreInfo = async (data: IAuditLogs) => {
        setOpenMoreInfoModal(true)
        setSelectedAuditLogs([data])
    }

    const refreshData = async () => {
        setRefreshingData(true)
        await revalidateFn('/audit_logs')
        setRefreshingData(false)
    }

    return (
        <div className="w-full p-2">
            {
                !data ? <TableSkeleton /> :
                    <DataTable
                        data={data}
                        columns={auditLogsColumns(openModalMoreInfo)}
                        addBtn={
                            <Button variant="secondary" className='me-4' onClick={refreshData} disabled={refreshingData}>
                                {
                                    refreshingData ? <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> : <Icon name='RefreshCcw' />
                                }
                            </Button>
                        }
                        columnBtnFilter
                        columnHidden={{}}
                        orderByObj={{
                            id: 'created_at',
                            desc: true
                        }}
                        exportData
                    />
            }

            <MyDialog
                title="Mas información de este registro de auditoría"
                description=""
                content={
                    <div className="space-y-5 flex flex-col gap-y-8">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="message">Antes</Label>
                            <Textarea placeholder="Sin resultados..." disabled contentEditable={false} defaultValue={selectedAuditLogs[0]?.before_update_data} rows={6} />
                        </div>

                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="message">Después</Label>
                            <Textarea placeholder="Sin resultados..." contentEditable={false} disabled defaultValue={selectedAuditLogs[0]?.after_update_data} rows={6} />
                        </div>

                        <div className="flex justify-end mt-[3%]">
                            <DialogFooter className='flex gap-x-4'>
                                <DialogClose asChild>
                                    <Button className="group">
                                        Cerrar
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </div>
                    </div>
                }
                btnTrigger={<></>}
                myClassName="max-w-[85vw] h-full max-h-[75vh]"
                closeModal={openMoreInfoModal}
                onOpenChange={() => setOpenMoreInfoModal(!openMoreInfoModal)}
            />

        </div>
    )
}