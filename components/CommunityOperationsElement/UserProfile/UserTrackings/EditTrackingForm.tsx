import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import {
    FormField
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import Icon from '@/components/Icon';
import Calendar from '@/components/Calendar';
import { format, parseISO } from 'date-fns';
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { appName } from '@/lib/appInfo';
import { getEnrollingTypes, addCommunityOperationUserTracking } from '@/lib/seed';
import { useSession } from 'next-auth/react';
import {
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
//import { setAddedCommunityOperationUserTracking } from '@/redux/slices/communityOperationUsersSlice';
//import { useDispatch } from 'react-redux';
import { IUserCommunityUserTracking } from '@/lib/interfaces';
import { TCommunityOperativeUserParams } from '@/lib/types';
import { revalidateFn } from '../../../../lib/revalidateActions';

interface IAddTrackingForm {
    name: string
    label: string
    type: string
    validation?: { required: string }
}

interface IFormInput {
    date: string
    enrolling_type_id: string
    observations: string
}

interface IEnrollingType {
    id: number
    name: string
}

const formInputs: IAddTrackingForm[] = [
    { name: "date", label: "Fecha", type: "date", validation: { required: "Campo obligatorio" } },
    { name: "enrolling_type_id", label: "Causa No Enrolamiento / Inicio de tratamiento", type: "select", validation: { required: "Campo obligatorio" } },
    { name: "observations", label: "Observaciones", type: "textarea", validation: { required: "Campo obligatorio" } }
];

const formSchema = z.object({
    date: z.string({ required_error: "La fecha es requerida" }).refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
        message: "Por favor introduzca una fecha válida",
    }),
    enrolling_type_id: z.string({ required_error: "Campo requerido" }),
    observations: z.string().min(1, { message: "Campo requerido" }),
})

interface IComponentProps extends TCommunityOperativeUserParams {
    selectedItem: IUserCommunityUserTracking[]
    setOpenEditTrackingForm: Dispatch<SetStateAction<boolean>>
    userName: string
}

const EditTrackingForm = ({ setOpenEditTrackingForm, selectedItem, params, userName }: IComponentProps) => {
    const [enrollingTypes, setEnrollingTypes] = useState<IEnrollingType[]>([])
    const [sendingForm, setSendingForm] = useState<boolean>(false)
    const { toast } = useToast()
    const { data: session } = useSession()
    const [openCalendar, setOpenCalendar] = useState<boolean>(false)

    // const dispatch = useDispatch()

    useEffect(() => {
        async function getEnrollingTypesFn() {
            const { error, data, message } = await getEnrollingTypes()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setEnrollingTypes(data)
            }
        }
        getEnrollingTypesFn()
    }, [toast])

    const methods = useForm<IFormInput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: String(selectedItem[0].date),
            enrolling_type_id: String(selectedItem[0].enrolling_type.id),
            observations: selectedItem[0].observations
        }
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSendingForm(true)

        const newData = {
            ...data,
            id: selectedItem[0].id,
            community_operation_user_id: params.id,
            user_id: session?.user.id,
            sai_id: session?.user.id_sai,
            from_username: session?.user.username,
            userName
        }

        const { error, message } = await addCommunityOperationUserTracking(Array(newData))

        if (error) {
            toast({
                variant: "destructive",
                title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            //dispatch(setAddedCommunityOperationUserTracking([resData.data]))
            await revalidateFn(`/community_operations/${params.id}/user_profile/trackings`)
            setOpenEditTrackingForm(false)
            toast({
                title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                description: message,
                duration: 5000
            })
        }
        setSendingForm(false)
    };

    return (
        <FormProvider {...methods}>
            <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                <div className='grid grid-cols-1 grid-rows-3'>
                    {formInputs.map((field) => {
                        return <div key={field.name}>
                            {
                                field.type === "select" ? (
                                    <FormField
                                        control={methods.control}
                                        name={field.name as keyof IFormInput}
                                        render={({ field: { value } }) => {
                                            return <div className="space-y-2">
                                                <Label htmlFor={field.name}>{field.label}</Label>
                                                <div className="relative">
                                                    <Select
                                                        onValueChange={(val) => {
                                                            methods.setValue(field.name as keyof IFormInput, val, { shouldValidate: true })
                                                        }}
                                                        value={String(value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {
                                                                enrollingTypes.length === 0 ? <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> :
                                                                    <SelectGroup>
                                                                        {
                                                                            field.name === "enrolling_type_id" && enrollingTypes.map((enrollingType) => <SelectItem key={enrollingType.id} value={String(enrollingType.id)}>{enrollingType.name}</SelectItem>)
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
                                        name="date"
                                        render={({ field: { onChange, value } }) => {
                                            let defaultDate
                                            if (value) {
                                                defaultDate = parseISO(value)
                                            }

                                            return (
                                                <Popover modal open={openCalendar} onOpenChange={setOpenCalendar}>
                                                    <PopoverTrigger asChild>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={field.name}>{field.label}</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    type="text"
                                                                    className="border cursor-pointer"
                                                                    readOnly
                                                                    value={value ? format(String(defaultDate), "dd/MM/yy") : "Seleccionar"}
                                                                />
                                                                <Icon name="CalendarIcon" className='absolute right-0 me-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                                            </div>
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={defaultDate}
                                                            defaultMonth={defaultDate}
                                                            onSelect={(date) => {
                                                                if (date) {
                                                                    const formattedDate = format(date, "yyyy-MM-dd")
                                                                    onChange(formattedDate)
                                                                    setOpenCalendar(false)
                                                                }
                                                            }}
                                                            startMonth={new Date(2015, 0)}
                                                            endMonth={new Date(2024, 11)}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }}
                                    /> : <div className="space-y-2">
                                        <Label htmlFor={field.name}>{field.label}</Label>
                                        <div className="relative">
                                            <Textarea
                                                placeholder="Describa..."
                                                {...methods.register(field.name as keyof IFormInput)}
                                                className="border"
                                            />
                                        </div>
                                    </div>
                            }
                            {methods.formState.errors[field.name as keyof IFormInput] && (
                                <p className="text-red-500 text-sm">
                                    {methods.formState.errors[field.name as keyof IFormInput]?.message}
                                </p>
                            )}
                        </div>
                    })}
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
        </FormProvider>
    )
}

export default EditTrackingForm