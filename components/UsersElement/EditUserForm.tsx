import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { IAddUserForm, ISai, IRoles, IStatus, IUserData } from '@/lib/interfaces'
import { useToast } from "@/hooks/use-toast"
import { appName } from '@/lib/appInfo'
import Icon from '../Icon'
import { getSAIs, getRoles, getUserById, addUser, getStatus, updateUser } from '@/lib/seed'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch } from 'react-redux'
import FormSkeleton from '../FormSkeleton'
import { setAddedUsers, setCloseModalEditUser } from '@/redux/slices/usersRoles'

interface ISelectedUserId {
    selectedUserId: number
}
const EditUserForm = ({ selectedUserId }: ISelectedUserId) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        control,
        setValue
    } = useForm<IAddUserForm>()
    const { toast } = useToast()
    const [sendingForm, setSendingForm] = useState(false)
    const [sais, setSais] = useState<ISai[]>([])
    const [roles, setRoles] = useState<IRoles[]>([])
    const [status, setStatus] = useState<IStatus[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [userData, setUserData] = useState<IUserData>({
        id: 0,
        profile_img: "",
        name: "",
        last_name: "",
        doc_id: "",
        email: "",
        status: 0,
        statusList: {
            id: 0,
            name: "",
            value: 0,
        },
        created_at: "",
        updated_at: "",
        username: "",
        id_sai: 0,
        id_role: 0,
        role: {
            id: 0,
            name: "",
            created_at: "",
            updated_at: "",
            is_admin: false
        },
        sai: {
            id: 0,
            created_at: "",
            updated_at: "",
            type: "",
            component: "",
            name: "",
            region: "",
            province_id: 0,
            municipe_id: 0
        }
    })
    const dispatch = useDispatch()

    // Load user
    useEffect(() => {
        async function getUserFn() {
            setLoadingData(true)
            const { error, data, message } = await getUserById(selectedUserId)

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Editar Usuario || " + appName,
                    description: message,
                    duration: 3000
                })
            } else {
                setUserData(data)

                setValue("sai", data.sai);
                setValue("role", data.role);
                setValue("status", data.status);
            }
            setLoadingData(false)
        }
        getUserFn()
    }, [toast, selectedUserId, setValue])

    // Load SAIs
    useEffect(() => {
        async function getSAIsFn() {
            const { error, data, message } = await getSAIs()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Editar Usuario || " + appName,
                    description: message,
                    duration: 3000
                })
            } else {
                setSais(data)
            }

        }
        getSAIsFn()
    }, [toast])

    // Load roles
    useEffect(() => {
        async function getRolesFn() {
            const { error, data, message } = await getRoles()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Editar Usuario || " + appName,
                    description: message,
                    duration: 3000
                })
            } else {
                setRoles(data)
            }

        }
        getRolesFn()
    }, [toast])

    // Load status
    useEffect(() => {
        async function getStatusFn() {
            const { error, data, message } = await getStatus()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Editar Usuario || " + appName,
                    description: message,
                    duration: 3000
                })
            } else {
                setStatus(data)
            }

        }
        getStatusFn()
    }, [toast])

    const onSubmit: SubmitHandler<IAddUserForm> = async (data) => {
        setSendingForm(true)

        const newData = {
            ...data,
            id_sai: data.sai.id,
            id_role: data.role.id,
        }

       const { error, data: resData, message } = await updateUser(selectedUserId, Array(newData))

        if (error) {
            toast({
                variant: "destructive",
                title: "Agregar Uusario || " + appName,
                description: message,
                duration: 3000
            })
        } else {
            dispatch(setAddedUsers([{ ...resData }]))
            dispatch(setCloseModalEditUser(false))
            toast({
                title: "Editar Usuario || " + appName,
                description: message,
                duration: 3000
            })
        }
        setSendingForm(false)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const a = {
            ...userData,
            [name]: value,
        }
        setUserData(a);
    };

    if (loadingData) {
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
                            value={userData.name}
                            onChange={handleChange}
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
                            value={userData.last_name}
                            onChange={handleChange}
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
                                    value: /\S+@\S+\.\S+/,
                                    message: "Formato de correo no válido",
                                },
                            })}
                            value={userData.email}
                            onChange={handleChange}
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
                            value={userData.doc_id}
                            onChange={handleChange}
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
                            value={userData.username}
                            onChange={handleChange}
                        />
                        <Icon name="UserCheck" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.username && errors.username.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sai">SAI</Label>
                    <Controller
                        name="sai"
                        control={control}
                        rules={{ required: 'Seleccionar SAI' }}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={String(field.value.id)}
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
                        name="role"
                        control={control}
                        rules={{ required: 'Seleccione el rol' }}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={String(field.value.id)}
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
                        name="status"
                        control={control}
                        rules={{ required: 'Seleccione el status' }}
                        render={({ field }) => (
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
                                required: false
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
                                required: false,
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

            <Button type="submit" className="w-full group bg-green-600 dark:bg-green-900" disabled={sendingForm}>
                {
                    sendingForm && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                }
                <span className='text-white'>Guardar</span>
                <Icon name="Save" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-white" />
            </Button>
        </form>
    )
}

export default EditUserForm