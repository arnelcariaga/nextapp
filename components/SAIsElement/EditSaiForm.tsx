import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { ISai } from '@/lib/interfaces'
import { useToast } from "@/hooks/use-toast"
import { appName } from '@/lib/appInfo'
import Icon from '../Icon'
import { getProvinces, getMunicipalities, getSaiById, updateSai } from '@/lib/seed'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch } from 'react-redux'
import FormSkeleton from '../FormSkeleton'
import { useSession } from 'next-auth/react'
import { setCloseModalEditSai } from '@/redux/slices/saisSlice'
import {
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { revalidateFn } from '../../lib/revalidateActions'

interface ISelectedSaiId {
    selectedSaiId: number
}
const EditSaiForm = ({ selectedSaiId }: ISelectedSaiId) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue
    } = useForm<ISai>()
    const { toast } = useToast()
    const [sendingForm, setSendingForm] = useState(false)
    const [sais, setSais] = useState<ISai>({
        id: 0,
        created_at: "",
        updated_at: "",
        type: "",
        component: "",
        name: "",
        region: "",
        province_id: 0,
        municipe_id: 0,
        municipe: {
            id: 0,
            name: "",
            created_at: "",
            updated_at: "",
            province_id: 0
        },
        province: {
            id: 0,
            name: "",
            created_at: "",
            updated_at: ""
        }
    })
    const [loadingData, setLoadingData] = useState(true)
    const dispatch = useDispatch()
    const { data: session } = useSession()
    const [provinces, setProvinces] = useState<ISai[]>([])
    const [municipalities, setMunicipalities] = useState<ISai[]>([]);

    // Load municipality by province_id
    useEffect(() => {
        async function getMunicipalityById() {
            const { error, data, message } = await getMunicipalities(Number(sais.province_id))

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Editar SAI || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setMunicipalities(data)
            }
        }
        getMunicipalityById()
    }, [toast, sais.province_id])

    // Load provinces
    useEffect(() => {
        async function getProvincesFn() {
            const { error, data, message } = await getProvinces()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Agregar SAI || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setProvinces(data)
            }
        }
        getProvincesFn()
    }, [toast])

    // Load SAI
    useEffect(() => {
        async function getSAIFn() {
            const { error, data, message } = await getSaiById(selectedSaiId)

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Editar SAI || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setSais(data)
                // Set default province, municipality and status
                setValue("province_id", data.province_id)
                setValue("municipe_id", data.municipe_id)
            }
            setLoadingData(false)
        }
        getSAIFn()
    }, [toast, selectedSaiId, setValue])

    const onSubmit: SubmitHandler<ISai> = async (data) => {
        setSendingForm(true)

        const newData = {
            ...data,
            from_user_id: Number(session?.user.id),
            from_username: session?.user.username
        }

        const { error, data: resData, message } = await updateSai(selectedSaiId, Array(newData))

        if (error) {
            toast({
                variant: "destructive",
                title: "Agregar SAI || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            //dispatch(setAddedSais([{ ...resData }]))
            await revalidateFn('/sais')
            dispatch(setCloseModalEditSai(false))
            toast({
                title: "Editar SAI || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingForm(false)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newDataSai = {
            ...sais,
            [name]: value,
        } as ISai
        setSais(newDataSai);
    };

    const handleProvinceChange = async (val: string) => {
        const provinceId = Number(val)
        if (provinceId) {
            const { error, data: resData, message } = await getMunicipalities(provinceId)

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Agregar SAI || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setMunicipalities(resData)
            }

        } else {
            setMunicipalities([]);
        }

    }

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
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("name", {
                                required: "Campo requerido"
                            })}
                            value={sais?.name}
                            onChange={handleChange}
                        />
                        <Icon name="FolderPen" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.name && errors.name.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Tipo</Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="SAI, Socio, etc."
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("type", {
                                required: "Campo requerido"
                            })}
                            value={sais.type}
                            onChange={handleChange}
                        />
                        <Icon name="ClipboardType" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.type && errors.type.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Componente</Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Clínico, Comunitario, etc."
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("component", {
                                required: "Campo requerido"
                            })}
                            value={sais.component}
                            onChange={handleChange}
                        />
                        <Icon name="Hospital" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.component && errors.component.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="docId">Regi&oacute;n</Label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="SD, LA, General, etc."
                            className={`dark:focus:border-indigo-600 pl-10 block w-full border-gray-300 dark:border-slate-800 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-transparent focus:display-none focus:ring-none`}
                            {...register("region", {
                                required: "Campo requerido"
                            })}
                            value={sais.region}
                            onChange={handleChange}
                        />
                        <Icon name="LocateFixed" className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    </div>
                    <span className='text-red-500 text-sm'>{errors.region && errors.region.message}</span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="sai">Provincia</Label>
                    <Controller
                        name="province_id"
                        control={control}
                        rules={{ required: 'Seleccionar provincia' }}
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    handleProvinceChange(value);
                                }}
                                value={String(field.value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        provinces.map(({ id, name }) => {
                                            return <SelectItem key={id} value={id.toString()}>{name}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <span className='text-red-500 text-sm'>
                        {errors.province?.id && errors.province.id?.message}
                    </span>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Municipio</Label>
                    <Controller
                        name="municipe_id"
                        control={control}
                        rules={{ required: 'Seleccione el municipio' }}
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
                                        municipalities.map(({ id, name }) => {
                                            return <SelectItem key={id} value={id.toString()}>{name}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <span className='text-red-500 text-sm'>{errors.municipe && errors.municipe.name?.message}</span>
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

export default EditSaiForm