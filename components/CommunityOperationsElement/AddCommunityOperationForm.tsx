"use client"
import { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { z, ZodRawShape } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import {
    Card,
    CardContent
} from "@/components/ui/card"
import { getMunicipalities, getMunicipalityPlaces, addCommunityOperation } from "@/lib/seed";
import { IProvinces, IMunicipalities, IAddCommunityOperation, IMunicipalytyPlaces, ISession } from "@/lib/interfaces";
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo";
//import FormSkeleton from "../FormSkeleton";
import Calendar from "../Calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Icon from "../Icon";
import { format } from "date-fns"
import {
    FormField
} from "@/components/ui/form"
import { useRouter } from "next/navigation";
//import { useSession } from "next-auth/react";

interface IFormInput {
    province: number
    municipality: number | string
    municipality_place: string
    date: Date
    shift: number
    no_team: number
    operation_type: number
    activity_location: string
}

interface IComponentProps {
    provinces: IProvinces[]
    session: ISession['session']
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

function AddCommunityOperationForm({ provinces, session }: IComponentProps) {
    //const [provinces, setProvinces] = useState<IProvinces[]>([])
    const [municipalities, setMunicipalities] = useState<IMunicipalities[]>([]);
    const [municipalityPlaces, setMunicipalityPlaces] = useState<IMunicipalytyPlaces[]>([]);
    const [loadingData, setLoadingData] = useState<boolean>(false)
    const [sendingForm, setSendingForm] = useState<boolean>(false)
    //const [showingSkeleton, setShowingSkeleton] = useState<boolean>(true)
    const { toast } = useToast()
    //const { data: session } = useSession()
    const router = useRouter()

    const methods = useForm<IFormInput>({
        resolver: zodResolver(createSchema(steps[0])),
    });

    // Load provinces
    // useEffect(() => {
    //     async function getProvincesFn() {
    //         const { error, data, message } = await getProvinces()

    //         if (error) {
    //             toast({
    //                 variant: "destructive",
    //                 title: "Agregar Operativo Comunidad || " + appName,
    //                 description: message,
    //                 duration: 5000
    //             })
    //         } else {
    //             setProvinces(data)
    //         }
    //         setLoadingData(false)
    //     }
    //     getProvincesFn()
    // }, [toast])

    // useEffect(() => {
    //     setTimeout(() => {
    //         setShowingSkeleton(false)
    //     }, 2000);
    // }, [])

    const handleProvinceChange = async (val: string) => {
        setLoadingData(true)

        const provinceId = Number(val)

        const { error, data: resData, message } = await getMunicipalities(provinceId)

        methods.setValue("municipality", "")
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
        const { error, data: resData, message } = await addCommunityOperation(Array(newData))

        if (error) {
            toast({
                variant: "destructive",
                title: "Agregar Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
            setSendingForm(false)

        } else {
            methods.reset();
            toast({
                title: "Agregar Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
            router.push(`/community_operations/${resData}/users`)
        }
        setSendingForm(false)
    };

    // if (showingSkeleton) {
    //     return <Card className="mx-5 mt-3 shadow">
    //         <CardContent>
    //             <div className="px-3 mt-[4%]">
    //                 <FormSkeleton />
    //             </div>
    //         </CardContent>
    //     </Card>
    // }
    return (
        <FormProvider {...methods}>
            <Card className="mx-5 mt-3 shadow">
                <CardContent>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="px-3 mt-[4%]">
                        <div
                            className="grid-cols-4 grid-rows-2 grid gap-4">
                            {steps[0].fields.map((field) => (
                                <div key={field.name}>
                                    {field.type === "select" ? (
                                        <div className="space-y-2">
                                            <Label htmlFor={field.name}>{field.label}</Label>
                                            <div className="relative">
                                                <Select
                                                    onValueChange={(value) => {
                                                        methods.setValue(field.name as keyof IFormInput, value, { shouldValidate: true })
                                                        field.name === "province" && handleProvinceChange(value);
                                                        field.name === "municipality" && handleMunicipalityChange(value)
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            !provinces || loadingData ?
                                                                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> :
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
                                    ) : field.name === "date" ?
                                        <FormField
                                            control={methods.control}
                                            name="date"
                                            render={({ field: { onChange, value } }) => (
                                                <Popover modal>
                                                    <PopoverTrigger asChild>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={field.name}>{field.label}</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    type="text"
                                                                    className="border cursor-pointer"
                                                                    readOnly
                                                                    value={value ? format(value, "d/M/yyyy") : "Seleccionar"}
                                                                />
                                                                <Icon name="CalendarIcon" className='absolute right-0 me-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                                            </div>
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={value}
                                                            onSelect={onChange}
                                                            startMonth={new Date(2024, 0)}
                                                            endMonth={new Date(2024, 11)}
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
                                        <p className="text-red-500 text-sm">
                                            {methods.formState.errors[field.name as keyof IFormInput]?.message}
                                        </p>
                                    )}
                                </div>
                            ))}

                        </div>

                        <div className="flex justify-end mt-[3%]">
                            <Button type="submit" disabled={sendingForm} className="group bg-green-600 dark:bg-green-900">
                                {
                                    sendingForm && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                                }
                                <span className='text-white'>Guardar</span>
                                <Icon name="Save" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-white" />
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </FormProvider>
    );
}

export default AddCommunityOperationForm;

