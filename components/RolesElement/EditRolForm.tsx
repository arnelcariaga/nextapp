import { ChangeEvent, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { IAddRol, IModules, IStatus } from '@/lib/interfaces'
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import DataTable from '../MyDataTable/data-table'
import { screensModulesColumns } from './screensModulesColumns'
import { getRolById, updateRol, getStatus } from '@/lib/seed'
import { appName } from '@/lib/appInfo'
import { setCloseModalEditRol, setAddedRoles } from '@/redux/slices/rolesSlice'
import { useDispatch } from 'react-redux'
import TableSkeleton from '../MyDataTable/TableSkeleton'
import { TEditRolForm } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from 'next-auth/react'

interface IDataResponse {
    id: number,
    name: string,
    permissions: {
        id_screen: number
        view: boolean,
        create: boolean,
        edit: boolean,
        delete: boolean
    }
}

const EditRolForm = ({ selectedRol }: TEditRolForm) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus,
        control,
        setValue
    } = useForm<IAddRol>()
    const { toast } = useToast()
    const [sendingForm, setSendingForm] = useState(false)
    const [modules, setModules] = useState<IModules[]>([])
    const [rolName, setRolName] = useState<string>(selectedRol.name)
    const [isAdmin, setIsAdmin] = useState(false)
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const [status, setStatus] = useState<IStatus[]>([])
    const dispatch = useDispatch()
    const { data: session } = useSession()

    // Load status
    useEffect(() => {
        async function getStatusFn() {
            const { error, data, message } = await getStatus()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Editar Rol || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setStatus(data)
            }

        }
        getStatusFn()
    }, [toast])

    // Get rol data
    useEffect(() => {
        async function getScreensModulesFn() {
            const { error, data, message } = await getRolById(selectedRol.id)

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Editar Rol || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                const screens = data.screens

                const screens_peremissions = screens.map((item: IDataResponse) => (
                    {
                        id: item.id,
                        name: item.name,
                        permissions: {
                            id_screen: item.permissions.id_screen,
                            view: item.permissions.view,
                            create: item.permissions.create,
                            edit: item.permissions.edit,
                            delete: item.permissions.delete
                        }
                    }
                ))
                setValue("status", data.status);
                setModules(screens_peremissions)
            }
            setDataTableLoading(false)

        }
        getScreensModulesFn()
    }, [toast, selectedRol])

    // Check screens permission are checked
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
            is_admin: isAdmin,
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username
        }

        const { error, data: resData, message } = await updateRol(selectedRol.id, Array(newData))

        if (error) {
            setFocus("name")
            toast({
                variant: "destructive",
                title: "Editar Rol || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            dispatch(setAddedRoles([{ ...resData }]))
            dispatch(setCloseModalEditRol(false))
        }
        setSendingForm(false)
    }

    const handleRolNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRolName(event.target.value);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {
                dataTableLoading ? <TableSkeleton />
                    :
                    <>
                        <div className="space-y-2">
                            <Label>Nombre del rol</Label>
                            <div className="flex items-start space-x-6">
                                <Input
                                    type="text"
                                    placeholder="Digitador, Promotor, Coordinador, etc."
                                    className={`${errors.name ? "border-red-500" : ""} dark:focus:ring:border-blue-500 w-[50%]`}
                                    {...register("name", {
                                        required: true,
                                        onChange: handleRolNameChange
                                    })}
                                    autoFocus={false}
                                    value={rolName}
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
                                <div className="space-y-2">
                                    <Label htmlFor="email">Status</Label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        rules={{ required: 'Seleccione el status' }}
                                        render={({ field }) => {
                                            return (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={String(field.value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            status.map(({ id, value, name }) => {
                                                                return <SelectItem key={id} value={value.toString()}>{name}</SelectItem>
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            )
                                        }}
                                    />
                                    <span className='text-red-500 text-sm'>{errors.status && errors.status.message}</span>
                                </div>
                            </div>
                        </div>

                        <DataTable
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
                    </>
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