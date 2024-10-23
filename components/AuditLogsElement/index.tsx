"use client"
import { useEffect, useState } from "react"
import { auditLogsColumns } from "./auditLogsColumns"
import DataTable from "../MyDataTable/data-table"
import MyDialog from "../MyDialog"
import { getActivityLogs } from "@/lib/seed"
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo"
import { IAuditLogs } from "@/lib/interfaces"
import TableSkeleton from "../MyDataTable/TableSkeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "../ui/label"

export default function AuditLogsElement() {
    const [auditLogs, setAuditLogsData] = useState<IAuditLogs[]>([])
    const [selectedAuditLogs, setSelectedAuditLogs] = useState<IAuditLogs[]>([])
    const { toast } = useToast()
    const [openMoreInfoModal, setOpenMoreInfoModal] = useState(false)
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)

    useEffect(() => {
        async function getAuditLogsFn() {
            const { error, data, message } = await getActivityLogs()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Registros de auditoría || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setAuditLogsData([...data])
            }
            setDataTableLoading(false)
        }
        getAuditLogsFn()
    }, [toast])

    const openModalMoreInfo = async (data: IAuditLogs) => {
        setOpenMoreInfoModal(true)
        setSelectedAuditLogs([data])
    }

    return (
        <div className="w-full p-2">
            {
                dataTableLoading ? <TableSkeleton /> :
                    <DataTable
                        data={auditLogs}
                        columns={auditLogsColumns(openModalMoreInfo)}
                        addBtn={<></>}
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
                    <div className="space-y-5">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="message">Antes</Label>
                            <Textarea placeholder="Sin resultados..." disabled defaultValue={selectedAuditLogs[0]?.before_update_data} />
                        </div>

                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="message">Después</Label>
                            <Textarea placeholder="Sin resultados..." disabled defaultValue={selectedAuditLogs[0]?.after_update_data} />
                        </div>
                    </div>

                }
                btnTrigger={<></>}
                myClassName="max-w-[85vw] h-full max-h-[85vh]"
                closeModal={openMoreInfoModal}
                onOpenChange={() => setOpenMoreInfoModal(!openMoreInfoModal)}
                closeBtnProps={{
                    variant: "outline",
                    type: "button",
                    className: "w-full mt-4"
                }}
            />

        </div>
    )
}