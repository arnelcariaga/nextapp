import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { IAddUserForm, ISai, IRoles, IStatus } from '@/lib/interfaces'
import { useToast } from "@/hooks/use-toast"
import { appName } from '@/lib/appInfo'
import Icon from '../Icon'
import { getRoles, getStatus, addUser, getSais } from '@/lib/seed'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { setCloseModalAddUser } from '@/redux/slices/usersSlice'
import { useDispatch } from 'react-redux'
import FormSkeleton from '../FormSkeleton'
import { useSession } from 'next-auth/react'
import {
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { revalidateFn } from '../../lib/revalidateActions'

const AddUserForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control
    } = useForm<IAddUserForm>()
    const { toast } = useToast()
    const [sendingForm, setSendingForm] = useState(false)
    const [sais, setSais] = useState<ISai[]>([])
    const [roles, setRoles] = useState<IRoles[]>([])
    const [status, setStatus] = useState<IStatus[]>([])
    const dispatch = useDispatch()
    const [loadingInputsData, setLoadingInputsData] = useState(true)
    const { data: session } = useSession()

    // Load SAIs
    useEffect(() => {
        async function getSAIsFn() {
            if (session?.user.token) {
                try {
                    const data = await getSais(session?.user.token)
                    setSais(data)
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

    // Load roles
    useEffect(() => {
        async function getRolesFn() {
            if (session?.user.token) {
                try {
                    const data = await getRoles(session?.user.token)
                    setRoles(data)
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
        getRolesFn()
    }, [toast, session?.user.token])

    // Load status, i put the setLoadingInputsData(false) here couz it's the last query, so i query above first
    useEffect(() => {
        async function getStatusFn() {
            const { error, data, message } = await getStatus()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Agregar Usuario || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setStatus(data)
            }
            setLoadingInputsData(false)

        }
        getStatusFn()
    }, [toast])

    const onSubmit: SubmitHandler<IAddUserForm> = async (data) => {
        setSendingForm(true)

        const newData = {
            email: data.email,
            id_sai: data.sai.name,
            id_role: data.role.name,
            name: data.name,
            last_name: data.last_name,
            doc_id: data.doc_id,
            password: data.password,
            status: data.statusList.name,
            username: data.username,
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username
        }

        const { error, message } = await addUser(Array(newData))

        if (error) {
            toast({
                variant: "destructive",
                title: "Agregar Usuario || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            //dispatch(setAddedUsers([{ ...resData }]))
            await revalidateFn('/users')
            dispatch(setCloseModalAddUser(false))
            toast({
                title: "Agregar Usuario || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingForm(false)
    };

    if (loadingInputsData) {
        return <FormSkeleton />
    }
    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className='grid grid-cols-3 grid-rows-3 gap-4'>
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Jhon"
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("name", {
                                required: "Campo requerido"
                            })}
                            autoFocus
                        />
                        <Icon name="User" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.name && errors.name.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido(s)</Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Doe"
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("last_name", {
                                required: "Campo requerido"
                            })}
                        />
                        <Icon name="User2" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.last_name && errors.last_name.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Correo</Label>
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="jondoe@coin.do"
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("email", {
                                required: "Campo requerido",
                                pattern: {
                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                    message: "Formato de correo no válido",
                                },
                            })}
                        />
                        <Icon name="Mail" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.email && errors.email.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="docId">Documento de identidad</Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="452-5975555-5"
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("doc_id", {
                                required: "Campo requerido"
                            })}
                        />
                        <Icon name="IdCard" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.doc_id && errors.doc_id.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username">Usuario</Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Ejemplo: jhondoe16"
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("username", {
                                required: "Campo requerido"
                            })}
                        />
                        <Icon name="UserCheck" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.username && errors.username.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sai">SAI</Label>
                    <Controller
                        name="sai.name"
                        control={control}
                        rules={{ required: 'Seleccionar SAI' }}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        sais.map(({ id, name }) => {
                                            return <SelectItem key={id} value={id.toString()}>{name}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <span className='text-red-500 text-sm'>
                        {errors.sai && errors.sai.name?.message}
                    </span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Rol</Label>
                    <Controller
                        name="role.name"
                        control={control}
                        rules={{ required: 'Seleccione el rol' }}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        roles.map(({ id, name }) => {
                                            return <SelectItem key={id} value={id.toString()}>{name}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <span className='text-red-500 text-sm'>{errors.role && errors.role.name?.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Status</Label>
                    <Controller
                        name="statusList.name"
                        control={control}
                        rules={{ required: 'Seleccione el status' }}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
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
                        )}
                    />
                    <span className='text-red-500 text-sm'>{errors.statusList && errors.statusList.name?.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Contrase&ntilde;a</Label>
                    <div className="relative">
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("password", {
                                required: "Campo requerido"
                            })}
                        />
                        <Icon name="Lock" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.password && errors.password.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Repetir contrase&ntilde;a</Label>
                    <div className="relative">
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register('repeatPassword', {
                                required: "Campo requerido",
                                validate: (val: string) => {
                                    if (watch('password') != val) {
                                        return "Las contraseñas no coinciden";
                                    }
                                }
                            })}
                        />
                        <Icon name="Unlock" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.repeatPassword && errors.repeatPassword.message}</span>
                </div>
            </div>

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

export default AddUserForm