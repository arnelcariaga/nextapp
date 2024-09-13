import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"
import { IAddRol } from '@/lib/interfaces'
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import DataTable from '../data-table'
import { screensModulesColumns } from './screensModulesColumns'
import { IModules, IRolesScreensObj } from "@/lib/interfaces"
import { getRolById, updateRol } from '@/lib/seed'
import { appName } from '@/lib/appInfo'
import { setCloseModalEditRol, setAddedRoles } from '@/redux/slices/rolesSlice'
import { useDispatch } from 'react-redux'
import TableSkeleton from '../TableSkeleton'

type TEditForm = {
    selectedEditRolId: number | null
}

interface IDataResponse {
    id: number,
    name: string,
    privileges: {
        id_screen: number
        view: boolean,
        create: boolean,
        edit: boolean,
        delete: boolean
    }
}

const EditRolForm = ({ selectedEditRolId }: TEditForm) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus
    } = useForm<IAddRol>()
    const { toast } = useToast()
    const [sendingForm, setSendingForm] = useState(false)
    const [modules, setModules] = useState<IModules[]>([])
    const [rolData, setRolData] = useState<IRolesScreensObj>()
    const [isAdmin, setIsAdmin] = useState(false)
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(false)
    const dispatch = useDispatch()

    useEffect(() => {
        async function getScreensModulesFn() {
            setDataTableLoading(true)
            const { error, data, message } = await getRolById(selectedEditRolId)

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Agregar Rol || " + appName,
                    description: message,
                    duration: 3000
                })
            } else {
                const rolId = data.id;
                const rolName = data.name
                const screens = data.screens


                const screens_peremissions = screens.map((item: IDataResponse) => (
                    {
                        id: item.id,
                        name: item.name,
                        permissions: {
                            id_screen: item.privileges.id_screen,
                            view: item.privileges.view,
                            create: item.privileges.create,
                            edit: item.privileges.edit,
                            delete: item.privileges.delete
                        }
                    }
                ))

                let rolDataStructure = {
                    id: rolId,
                    name: rolName
                }
                setRolData(rolDataStructure)
                setModules(screens_peremissions)
            }
            setDataTableLoading(false)

        }
        getScreensModulesFn()
    }, [toast, selectedEditRolId])

    useEffect(() => {
        const allChecked = modules.every(
            (row) =>
                row.permissions.view &&
                row.permissions.create &&
                row.permissions.edit &&
                row.permissions.delete
        );
        setIsAdmin(allChecked);
    }, [modules]);

    const handleDataTableCheckboxChange = (rowIndex: number, permissionType: keyof IModules["permissions"]) => {
        const updatedData = [...modules];
        updatedData[rowIndex] = {
            ...updatedData[rowIndex],
            permissions: {
                ...updatedData[rowIndex].permissions,
                [permissionType]: !updatedData[rowIndex].permissions[permissionType],
            },
        };
        setModules(updatedData);
    };

    const columns = screensModulesColumns(handleDataTableCheckboxChange)

    const handleAdminChange = () => {
        const updatedData = modules.map((row) => ({
            ...row,
            permissions: {
                id_screen: row.permissions.id_screen,
                view: !isAdmin,
                create: !isAdmin,
                edit: !isAdmin,
                delete: !isAdmin,
            },
        }));
        setModules(updatedData);
        setIsAdmin(!isAdmin);
    };

    const onSubmit: SubmitHandler<IAddRol> = async (data) => {
        setSendingForm(true)

        const newData = {
            ...data,
            screens: modules,
            is_admin: isAdmin
        }

        const { error, data: resData, message } = await updateRol(selectedEditRolId, Array(newData))

        if (error) {
            setFocus("name")
            toast({
                variant: "destructive",
                title: "Agregar Rol || " + appName,
                description: message,
                duration: 3000
            })
        } else {
            const updated_at = new Date().toString();

            dispatch(setAddedRoles([{ ...resData, updated_at }]))
            dispatch(setCloseModalEditRol(false))
        }
        setSendingForm(false)
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
                <Label>Nombre del rol</Label>
                <div className="flex items-start space-x-6">
                    <Input
                        type="text"
                        placeholder="Digitador, Promotor, Coordinador, etc."
                        className={`${errors.name ? "border-red-500" : ""} dark:focus:ring:border-blue-500 w-[50%]`}
                        {...register("name", {
                            required: true
                        })}
                        autoFocus={false}
                        defaultValue={rolData?.name}
                    />
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isAdmin"
                                checked={isAdmin}
                                onCheckedChange={handleAdminChange}
                                {...register("isAdmin")}
                            />
                            <Label
                                htmlFor="isAdmin"
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Administrador
                            </Label>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Los administradores por defecto pueden cambiar pacientes a otro SAI y tener control total del sistema
                        </p>
                    </div>
                </div>
            </div>

            {
                dataTableLoading && modules.length === 0 ? <TableSkeleton /> : <DataTable
                    columns={columns}
                    data={modules}
                    addBtn={null}
                    columnBtnFilter={false}
                    columnHidden={{
                        id: false
                    }}
                    orderByObj={{
                        id: 'name',
                        desc: false
                    }}
                />
            }

            <Button type="submit" className="w-full group bg-green-600 dark:bg-green-900" disabled={sendingForm}>
                {
                    sendingForm && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                }
                <span className='text-white'>Guardar</span>
                <Save className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-white" />
            </Button>
        </form>
    )
}

export default EditRolForm