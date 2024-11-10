import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, SubmitHandler } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import DataTable from '../MyDataTable/data-table'
import { screensModulesColumns } from './screensModulesColumns'
import { getScreensModules, addRol } from '@/lib/seed'
import { appName } from '@/lib/appInfo'
import { setCloseModalAddRol, setAddedRoles } from '@/redux/slices/rolesSlice'
import { useDispatch } from 'react-redux'
import TableSkeleton from '../MyDataTable/TableSkeleton'
import { useSession } from 'next-auth/react'
import {
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import Icon from '../Icon'

type ScreenModules = {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
};

interface IScreenPermissions {
    id_role: number
    id_screen: number
    view: string
    create: string
    edit: string
    delete: string
}

interface IModules {
    id: number
    name: string
}

interface IModulesWithPermissions extends IModules {
    permissions: IScreenPermissions
}

interface IAddRol {
    name: string,
    isAdmin: boolean,
    status: number
}

const AddRolForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setFocus
    } = useForm<IAddRol>()
    const { toast } = useToast()
    const [sendingForm, setSendingForm] = useState(false)
    const [modules, setModules] = useState<IModulesWithPermissions[]>([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [dataTableLoading, setDataTableLoading] = useState<boolean>(true)
    const dispatch = useDispatch()
    const { data: session } = useSession()

    // Get screens modules
    useEffect(() => {
        async function getScreensModulesFn() {
            const { error, data, message } = await getScreensModules()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Agregar Rol || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                const resData: ScreenModules[] = data;

                const updatedModules: IModulesWithPermissions[] = resData.map((module) => ({
                    ...module,
                    permissions: {
                        id_role: 0,
                        id_screen: 0,
                        view: "0",
                        create: "0",
                        edit: "0",
                        delete: "0",
                    },
                }));

                setModules(updatedModules);
            }

            setDataTableLoading(false)

        }
        getScreensModulesFn()
    }, [toast])

    useEffect(() => {
        const allChecked = modules.every(
            (row) =>
                row.permissions.view === "1" &&
                row.permissions.create === "1" &&
                row.permissions.edit === "1" &&
                row.permissions.delete === "1"
        );
        setIsAdmin(allChecked);
    }, [modules]);

    const handleDataTableCheckboxChange = (rowIndex: number, permissionType: string) => {
        const updatedData = [...modules];

        updatedData[rowIndex] = {
            ...updatedData[rowIndex],
            permissions: {
                ...updatedData[rowIndex].permissions,
                [permissionType]: updatedData[rowIndex].permissions[permissionType as keyof IModulesWithPermissions["permissions"]] === "0" ? "1" : "0",
            },
        };
        setModules(updatedData);
    };

    const columns = screensModulesColumns(handleDataTableCheckboxChange)

    const handleAdminChange = () => {
        const updatedData: IModulesWithPermissions[] = modules.map((row) => ({
            ...row,
            permissions: {
                id_role: 0,
                id_screen: 0,
                view: !isAdmin ? "1" : "0",
                create: !isAdmin ? "1" : "0",
                edit: !isAdmin ? "1" : "0",
                delete: !isAdmin ? "1" : "0",
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
            from_username: session?.user.username,
        }

        const { error, data: resData, message } = await addRol(Array(newData))

        if (error) {
            setFocus("name")
            toast({
                variant: "destructive",
                title: "Agregar Rol || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            dispatch(setAddedRoles([{ ...resData }]))
            dispatch(setCloseModalAddRol(false))
        }
        setSendingForm(false)
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {
                dataTableLoading && modules.length === 0 ? <TableSkeleton />
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
                                        required: true
                                    })}
                                    autoFocus
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

                        <DataTable
                            columns={columns}
                            data={modules}
                            addBtn={null}
                            columnBtnFilter={false}
                            columnHidden={{}}
                            orderByObj={{
                                id: 'name',
                                desc: false
                            }}
                            exportData={false}
                        />
                    </>
            }

            <div className="flex justify-end mt-[3%]">
                <DialogFooter className='flex gap-x-4'>
                    <DialogClose asChild>
                        <Button className="group">
                            Cerrar
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={sendingForm} className="group bg-green-600 dark:bg-green-900">
                        {
                            sendingForm && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                        }
                        <span className='text-white'>Guardar</span>
                        <Icon name="Save" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-white" />
                    </Button>
                </DialogFooter>
            </div>
        </form>
    )
}

export default AddRolForm