import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { appName } from '@/lib/appInfo'
import Icon from '../Icon'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup
} from "@/components/ui/select"
import FormSkeleton from '../FormSkeleton'
import {
    IProvinces,
    IMunicipalities,
    IAddCommunityOperation,
    IMunicipalytyPlaces,
    ICommunityOperationDataTable
} from "@/lib/interfaces";
import { z, ZodRawShape } from 'zod';
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import {
    getProvinces,
    getMunicipalities,
    getMunicipalityPlaces,
    getAllMunicipalities,
    getAllMunicipalityPlaces,
    updateCommunityOperation
} from "@/lib/seed";
import { Card, CardContent } from '../ui/card'
import { FormField } from '../ui/form'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import Calendar from '../Calendar'
import { format } from 'date-fns'
import { useDispatch } from 'react-redux'
import { setCloseModalEditCommunityOperation } from '@/redux/slices/communityOperationsSlice'
import {
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { revalidateFn } from './revalidateActions'

interface IFormInput {
    province: number
    municipality: number
    municipality_place: string
    date: Date
    shift: number
    no_team: number
    operation_type: number
    activity_location: string
}

interface ISelectedItem {
    selectedItem?: ICommunityOperationDataTable
}

// Steps structure
const steps: IAddCommunityOperation[] = [
    {
        fields: [
            { name: "province", label: "Provincia", type: "select", validation: { required: "Campo obligatorio" } },
            { name: "municipality", label: "Municipio", type: "select", validation: { required: "Campo obligatorio" } },
            { name: "municipality_place", label: "Barrio/Paraje/Comunidad", type: "select", validation: { required: "Campo obligatorio" } },
            { name: "activity_location", label: "Lugar de actividad", type: "text", validation: { required: "Campo obligatorio" } },
            { name: "date", label: "Fecha", type: "date", validation: { required: "Campo obligatorio" } },
            { name: "shift", label: "Tanda", type: "select", validation: { required: "Campo obligatorio" } },
            { name: "no_team", label: "No. equipo", type: "number", validation: { required: "Campo obligatorio" } },
            { name: "operation_type", label: "Tipo De Operativo", type: "select", validation: { required: "Campo obligatorio" } },
        ]
    }
];

// Create dynamic schema with zod based in the steps
const createSchema = (step: any) => {
    const shape: ZodRawShape = {};
    steps[0].fields.forEach((field: any) => {
        if (field.validation) {
            shape[field.name] = z.string({
                required_error: field.validation.required
            }).min(1, field.validation.required);
        }

        if (field.name === "date") {
            shape[field.name] = z.date({
                required_error: field.validation.required
            })
        }
    });
    return z.object(shape);
};

function ErrorMessage({ message }: { message: string }) {
    return <p className="text-red-500 text-sm">{message}</p>;
}

function AddCommunityOperationForm({
    selectedItem
}: ISelectedItem) {
    const [provinces, setProvinces] = useState<IProvinces[]>([])
    const [municipalities, setMunicipalities] = useState<IMunicipalities[]>([]);
    const [municipalityPlaces, setMunicipalityPlaces] = useState<IMunicipalytyPlaces[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(true)
    const [sendingForm, setSendingForm] = useState<boolean>(false)
    const { toast } = useToast()
    const { data: session } = useSession()
    const dispatch = useDispatch()

    const methods = useForm<IFormInput>({
        resolver: zodResolver(createSchema(steps[0])),
        defaultValues: {
            province: selectedItem?.province_id,
            municipality: selectedItem?.municipe_id,
            municipality_place: String(selectedItem?.municipality_place_id),
            activity_location: selectedItem?.activity_location,
            date: new Date(String(selectedItem?.date)),
            shift: selectedItem?.shift_id,
            no_team: selectedItem?.no_of_team,
            operation_type: selectedItem?.community_operation_type_id
        }
    });

    useEffect(() => {
        async function loadData() {
            setLoadingData(true);
            try {
                const [provincesData, municipalitiesData, placesData] = await Promise.all([
                    getProvinces(),
                    getAllMunicipalities(),
                    getAllMunicipalityPlaces()
                ]);

                setProvinces(provincesData.data || []);
                setMunicipalities(municipalitiesData.data || []);
                setMunicipalityPlaces(placesData.data || []);
            } catch (error) {

                if (error instanceof Error) {
                    toast({
                        variant: "destructive",
                        title: "Editar Operativo Comunidad || " + appName,
                        description: error.message,
                        duration: 5000
                    })
                }

            } finally {
                setLoadingData(false); // Siempre se ejecuta, incluso si hay un error
            }
        }

        loadData();
    }, [toast]);

    const handleProvinceChange = async (val: string) => {
        setLoadingData(true)

        const provinceId = Number(val)

        const { error, data: resData, message } = await getMunicipalities(provinceId)

        methods.setValue("municipality", Number(""))
        setMunicipalities([])

        if (error) {
            toast({
                variant: "destructive",
                title: "Agregar Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            setMunicipalities(resData)
        }
        setLoadingData(false)

    }

    const handleMunicipalityChange = async (val: string) => {
        setLoadingData(false)

        const municipalityId = Number(val)

        const { error, data: resData, message } = await getMunicipalityPlaces(municipalityId)

        methods.setValue("municipality_place", "")
        setMunicipalityPlaces([])

        if (error) {
            toast({
                variant: "destructive",
                title: "Agregar Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            setMunicipalityPlaces(resData)
        }
        setLoadingData(false)

    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSendingForm(true)

        const newData = {
            community_operation_id: selectedItem?.id,
            province_id: data.province,
            municipe_id: data.municipality,
            municipality_place_id: data.municipality_place,
            activity_location: data.activity_location,
            date: data.date,
            shift_id: data.shift,
            no_of_team: data.no_team,
            community_operation_type_id: data.operation_type,
            user_id: session?.user.id,
            sai_id: session?.user.id_sai,
            from_username: session?.user.username
        }
        const { error, data: resData, message } = await updateCommunityOperation(Array(newData))

        if (error) {
            toast({
                variant: "destructive",
                title: "Editar Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            await revalidateFn('/community_operations')
            //dispatch(setAddedCommunityOperation([{ ...resData }]))
            dispatch(setCloseModalEditCommunityOperation(false))
            toast({
                title: "Editar Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingForm(false)
    };

    if (loadingData) {
        return <Card className="border-0">
            <CardContent>
                <div className="px-3 mt-[4%]">
                    <FormSkeleton />
                </div>
            </CardContent>
        </Card>
    }
    return (
        <FormProvider {...methods}>
            <Card className="border-0">
                <CardContent>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="px-3 mt-[4%]">
                        <div
                            className="grid-cols-4 grid-rows-2 grid gap-4">
                            {steps[0].fields.map((field) => (
                                <div key={field.name}>
                                    {field.type === "select" ? (
                                        <FormField
                                            control={methods.control}
                                            name={field.name as keyof IFormInput}
                                            render={({ field: { value, onChange } }) => {
                                                return <div className="space-y-2">
                                                    <Label htmlFor={field.name}>{field.label}</Label>
                                                    <div className="relative">
                                                        <Select
                                                            onValueChange={(value) => {
                                                                onChange()
                                                                methods.setValue(field.name as keyof IFormInput, value, { shouldValidate: true });
                                                                field.name === "province" && handleProvinceChange(value);
                                                                field.name === "municipality" && handleMunicipalityChange(value);
                                                            }}
                                                            value={String(value)}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccionar" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {
                                                                    <SelectGroup>

                                                                        {
                                                                            field.name === "province" &&
                                                                            provinces.map(({ id, name }) => (
                                                                                <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                                                                            ))
                                                                        }

                                                                        {
                                                                            field.name === "municipality" &&
                                                                            municipalities.map(({ id, name }) => (
                                                                                <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                                                                            ))
                                                                        }

                                                                        {
                                                                            field.name === "shift" &&
                                                                            <>
                                                                                <SelectItem value='1'>Matutino</SelectItem>
                                                                                <SelectItem value='2'>Vespertino</SelectItem>
                                                                                <SelectItem value='3'>Nocturno</SelectItem>
                                                                            </>
                                                                        }

                                                                        {
                                                                            field.name === "operation_type" &&
                                                                            <>
                                                                                <SelectItem value='1'>Operativo clásico</SelectItem>
                                                                                <SelectItem value='2'>Casa a casa</SelectItem>
                                                                                <SelectItem value='3'>Clínica móvil</SelectItem>
                                                                                <SelectItem value='4'>Informante clave</SelectItem>
                                                                            </>
                                                                        }

                                                                        {
                                                                            field.name === "municipality_place" &&
                                                                            municipalityPlaces.map(({ id, name }) => (
                                                                                <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                                                                            ))
                                                                        }
                                                                    </SelectGroup>
                                                                }

                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            }}
                                        />

                                    ) : field.name === "date" ?
                                        <FormField
                                            control={methods.control}
                                            name="date"
                                            render={({ field: { onChange, value } }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={field.name}>{field.label}</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    type="text"
                                                                    className="border cursor-pointer"
                                                                    readOnly
                                                                    value={value ? format(new Date(value), "d/M/yyyy") : "Seleccionar"}
                                                                />
                                                                <Icon name="CalendarIcon" className='absolute right-0 me-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                                            </div>
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={new Date(value)}
                                                            onSelect={onChange}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        : (
                                            <div className="space-y-2">
                                                <Label htmlFor={field.name}>{field.label}</Label>
                                                <div className="relative">
                                                    <Input
                                                        {...methods.register(field.name as keyof IFormInput)}
                                                        type={field.type}
                                                        className="border"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    {methods.formState.errors[field.name as keyof IFormInput] && (
                                        <ErrorMessage message={methods.formState.errors[field.name as keyof IFormInput]?.message as string} />
                                    )}
                                </div>
                            ))}

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
                </CardContent>
            </Card>
        </FormProvider>
    );
}

export default AddCommunityOperationForm;