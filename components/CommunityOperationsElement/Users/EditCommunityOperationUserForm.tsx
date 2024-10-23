import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useToast } from "@/hooks/use-toast"
import { appName } from '@/lib/appInfo'
import Icon from '../../Icon'
import { getNationalities, getReferralTypes, updateCommunityOperationUser } from '@/lib/seed'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import Calendar from "../../Calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    FormField
} from "@/components/ui/form"
import { format, differenceInYears } from 'date-fns';
import { IFormstep } from '@/lib/interfaces';
import { Textarea } from "@/components/ui/textarea"
import { ICommunityOperationUsersDataTable } from '@/lib/interfaces';
import { setAddedCommunityOperationUser, setCloseModalEditCommunityOperationUser } from '@/redux/slices/communityOperationUsersSlice';
import FormSkeleton from '@/components/FormSkeleton';
import {
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { Card, CardContent } from '@/components/ui/card';

interface IFormInput {
    name: string
    last_name: string
    genre_id: number
    birth_date: Date
    age: number
    doc_id: string
    tel: string
    referral_number: number
    referral_type_id: number
    trial_promotion_talk_received: number
    hiv_test_in_last_twelve_mount: number
    beneficiary_nationality: number
    beneficiary_mother_nationality: number
    beneficiary_father_nationality: number
    serology_status_id: number
    tester: string
    observation: string
    is_pregnant: number
}

interface IInputsDataFetch {
    id: number
    name: string
}

const formInputs: IFormstep[] = [
    { name: "name", label: "Nombre(s)", type: "text", validation: { required: "Campo obligatorio" } },
    { name: "last_name", label: "Apellido(s)", type: "text", validation: { required: "Campo obligatorio" } },
    { name: "genre_id", label: "Sexo", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "is_pregnant", label: "Embarazada?", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "birth_date", label: "Fecha Nacimiento", type: "date", validation: { required: "Campo obligatorio" } },
    { name: "age", label: "Edad", type: "number", validation: { required: "Campo obligatorio" }, options: { readOnly: true } },
    { name: "doc_id", label: "Cédula/Pasaporte", type: "text" },
    { name: "tel", label: "Teléfono", type: "text" },
    { name: "referral_number", label: "No. Referimiento", type: "number", validation: { required: "Campo obligatorio" } },
    { name: "referral_type_id", label: "Tipo Referimiento", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "trial_promotion_talk_received", label: "Recibió charla de promoción de prueba", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "hiv_test_in_last_twelve_mount", label: "Prueba VIH en los últimos 12 meses", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "beneficiary_nationality", label: "Nacionalidad Beneficiario", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "beneficiary_mother_nationality", label: "Nacionalidad de la Madre", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "beneficiary_father_nationality", label: "Nacionalidad del Padre", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "serology_status_id", label: "Estado Serológico", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "tester", label: "Promotor que testea", type: "text", validation: { required: "Campo obligatorio" } },
    { name: "observation", label: "Observaciones", type: "textarea" },
];

type TTestStatus = "trial_promotion_talk_received" | "hiv_test_in_last_twelve_mount";
type TNationalities = "beneficiary_nationality" | "beneficiary_mother_nationality" | "beneficiary_father_nationality";

function isValidTestStatus(status: string): status is TTestStatus {
    return status === "trial_promotion_talk_received" ||
        status === "hiv_test_in_last_twelve_mount" ||
        status === "is_pregnant"
}

function isValidNationality(status: string): status is TNationalities {
    return status === "beneficiary_nationality" ||
        status === "beneficiary_mother_nationality" ||
        status === "beneficiary_father_nationality"
}

const formSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido" }),
    last_name: z.string().min(1, { message: "El apellido es requerido" }),
    genre_id: z.string({ required_error: "El género es requerido" }),
    is_pregnant: z.string().default("2").optional(),
    birth_date: z.date({ required_error: "La fecha de nacimiento es requerida" }),
    age: z.number({ required_error: "La edad es requerida" }),
    doc_id: z.string().optional(),
    tel: z.string().optional(),
    referral_number: z.string().min(1, { message: "El número de referencia es requerido" }),
    referral_type_id: z.string({ required_error: "El tipo de referencia es requerido" }),
    trial_promotion_talk_received: z.string({ required_error: "Es necesario indicar si recibió la charla de promoción" }),
    hiv_test_in_last_twelve_mount: z.string({ required_error: "Es necesario indicar si se realizó una prueba de VIH en los últimos 12 meses" }),
    beneficiary_nationality: z.string({ required_error: "La nacionalidad del beneficiario es requerida" }),
    beneficiary_mother_nationality: z.string({ required_error: "La nacionalidad de la madre del beneficiario es requerida" }),
    beneficiary_father_nationality: z.string({ required_error: "La nacionalidad del padre del beneficiario es requerida" }),
    serology_status_id: z.string({ required_error: "El estado serológico es requerido" }),
    tester: z.string().min(1, { message: "El nombre del promotor es requerido" }),
    observation: z.string().optional(),
}).refine((data) => {
    if (data.genre_id === '2') {
        return !!data.is_pregnant
    }
    data.is_pregnant = '2'
    return true;
}, {
    message: "Debes especificar si está embarazada",
    path: ['is_pregnant']
})

interface ISelectedItem {
    selectedItem?: ICommunityOperationUsersDataTable
}

const EditCommunityOperationUserForm = ({ selectedItem }: ISelectedItem) => {
    const { toast } = useToast()
    const [sendingForm, setSendingForm] = useState<boolean>(false)
    const [referralTypes, setReferralTypes] = useState<IInputsDataFetch[]>([])
    const [nationalities, setNationalities] = useState<IInputsDataFetch[]>([])
    const [loadingData, setLoadingData] = useState<boolean>(true)
    const dispatch = useDispatch()
    const { data: session } = useSession()

    const methods = useForm<IFormInput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: selectedItem?.name,
            last_name: selectedItem?.last_name,
            genre_id: selectedItem?.genre_id,
            birth_date: new Date(String(selectedItem?.birth_date)),
            age: Number(selectedItem?.age),
            doc_id: selectedItem?.doc_id ?? '',
            tel: selectedItem?.tel ?? '',
            referral_number: selectedItem?.referral_number,
            referral_type_id: selectedItem?.referral_type_id,
            trial_promotion_talk_received: selectedItem?.trial_promotion_talk_received,
            hiv_test_in_last_twelve_mount: selectedItem?.hiv_test_in_last_twelve_mount,
            beneficiary_nationality: selectedItem?.beneficiary_nationality,
            beneficiary_mother_nationality: selectedItem?.beneficiary_mother_nationality,
            beneficiary_father_nationality: selectedItem?.beneficiary_father_nationality,
            serology_status_id: selectedItem?.serology_status_id,
            tester: selectedItem?.tester,
            observation: selectedItem?.observation ?? '',
            is_pregnant: selectedItem?.is_pregnant,
        }
    });

    const genreInput = String(methods.watch("genre_id"))

    useEffect(() => {
        async function loadData() {
            setLoadingData(true);
            try {
                const [referralTypesData, nationalitiesData] = await Promise.all([
                    getReferralTypes(),
                    getNationalities()
                ]);

                setReferralTypes(referralTypesData.data || []);
                setNationalities(nationalitiesData.data || []);
            } catch (error) {

                if (error instanceof Error) {
                    toast({
                        variant: "destructive",
                        title: "Editar Usuario A Operativo Comunidad || " + appName,
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

    const calculateAge = (date: string) => {
        const currentDate = new Date();
        const birthDateObj = new Date(date);
        return differenceInYears(currentDate, birthDateObj);
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSendingForm(true)

        const newData = {
            ...data,
            user_id: Number(session?.user.id),
            sai_id: Number(session?.user.id_sai),
            from_username: session?.user.username,
            id: Number(selectedItem?.id),
            community_operation_id: selectedItem?.community_operation_id
        }

        const { error, data: resData, message } = await updateCommunityOperationUser(Array(newData))

        if (error) {
            toast({
                variant: "destructive",
                title: "Editar Uusuario a Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            dispatch(setAddedCommunityOperationUser([{ ...resData }]))
            dispatch(setCloseModalEditCommunityOperationUser(false))
            toast({
                title: "Editar Uusuario a Operativo Comunidad || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingForm(false)
    };

    if (loadingData) {
        return <FormSkeleton />
    }
    return (
        <FormProvider {...methods}>
            <Card className="border-0">
                <CardContent>
                    <form className="px-1 mt-[2%]" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                        <div className='grid grid-cols-4 grid-rows-3 gap-4'>
                            {formInputs.map((field) => {
                                if (field.name === 'is_pregnant') {
                                    if (genreInput !== '2') {
                                        return null;
                                    }
                                }
                                return (
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
                                                                    methods.setValue(field.name as keyof IFormInput, value, { shouldValidate: true })
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
                                                                                field.name === "referral_type_id" &&
                                                                                referralTypes.map(({ id, name }) => (
                                                                                    <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                                                                                ))
                                                                            }

                                                                            {
                                                                                field.name === "genre_id" &&
                                                                                <>
                                                                                    <SelectItem value="1">Masculino</SelectItem>
                                                                                    <SelectItem value="2">Femenino</SelectItem>
                                                                                </>
                                                                            }

                                                                            {
                                                                                isValidTestStatus(field.name) &&
                                                                                <>
                                                                                    <SelectItem value="1">Si</SelectItem>
                                                                                    <SelectItem value="2">No</SelectItem>
                                                                                </>
                                                                            }

                                                                            {
                                                                                isValidNationality(field.name) &&
                                                                                nationalities.map(({ id, name }) => (
                                                                                    <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                                                                                ))
                                                                            }

                                                                            {
                                                                                field.name === "serology_status_id" &&
                                                                                <>
                                                                                    <SelectItem value="1">Positivo</SelectItem>
                                                                                    <SelectItem value="2">Negativo</SelectItem>
                                                                                    <SelectItem value="3">Positivo Conocido</SelectItem>
                                                                                </>
                                                                            }
                                                                        </SelectGroup>
                                                                    }

                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                }}
                                            />

                                        ) : field.type === "date" ?
                                            <FormField
                                                control={methods.control}
                                                name={field.name as keyof IFormInput}
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
                                                                onSelect={(v) => {
                                                                    onChange(v)
                                                                    methods.setValue("age", calculateAge(String(v)), { shouldValidate: true })
                                                                }}
                                                                startMonth={new Date(1930, 0)}
                                                                endMonth={new Date(2013, 11)}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                            />
                                            : field.type === "textarea" ?
                                                (
                                                    <div className="space-y-2">
                                                        <Label htmlFor={field.name}>{field.label}</Label>
                                                        <div className="relative">
                                                            <Textarea
                                                                placeholder="Describa..."
                                                                {...methods.register(field.name as keyof IFormInput)}
                                                                className="border"
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                                : (
                                                    <div className="space-y-2">
                                                        <Label htmlFor={field.name}>{field.label}</Label>
                                                        <div className="relative">
                                                            <Input
                                                                {...methods.register(field.name as keyof IFormInput)}
                                                                type={field.type}
                                                                className="border"
                                                                readOnly={field?.options?.readOnly}
                                                                disabled={field?.options?.readOnly}
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
                                )
                            })}
                        </div>

                        <div className="flex justify-end mt-[3%]">
                            <DialogFooter className='flex gap-x-4'>
                                <DialogClose asChild>
                                    <Button className="group">
                                        Cerrar
                                    </Button>
                                </DialogClose>
                                <Button type="submit" className="group bg-green-600 dark:bg-green-900" disabled={sendingForm}>
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
    )
}

export default EditCommunityOperationUserForm