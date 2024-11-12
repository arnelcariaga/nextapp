import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
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
import { format, parseISO, isValid } from 'date-fns';
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { appName } from '@/lib/appInfo';
import { getSAIs, addCommunityOperationUserEnrolling, getFappsIdById } from '@/lib/seed';
import { TCommunityOperativeUserParams } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { ISai, IUserCommunityUserEnrolling } from '@/lib/interfaces';
import { setAddedUserProfile, setAddedCommunityOperationUserEnrolling } from '@/redux/slices/communityOperationUsersSlice';
import { useDispatch } from 'react-redux';
import {
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"

interface IAddForm {
    name: string
    label: string
    type: string
    validation?: { required: string }
}

interface IFormInput {
    enrolling_sai_id: string
    fapps_id: number
    enrolling_date: Date
    treatment_start_date: Date
    tester: string
}

const formInputs: IAddForm[] = [
    { name: "enrolling_sai_id", label: "SAI", type: "select" },
    { name: "fapps_id", label: "IDFAPPS", type: "number" },
    { name: "enrolling_date", label: "Fecha enrolamiento", type: "date" },
    { name: "treatment_start_date", label: "Fecha inicio tratamiento", type: "date" },
    { name: "tester", label: "Promotor que testea", type: "text" },
];

const formSchema = z.object({
    enrolling_sai_id: z.string({ required_error: "SAI requerido" }),
    fapps_id: z.string({ required_error: "Campo requerido" }).min(6, { message: "ID FAPPS debe contener minimo 6 carácteres" }).max(10, { message: "Carácteres muy largos" }),
    enrolling_date: z.coerce.date({ required_error: "La fecha es requerida" }),
    treatment_start_date: z.coerce.date().optional().nullable(),
    tester: z.string().min(1, { message: "Campo requerido" })
})

interface IComponentProps extends TCommunityOperativeUserParams {
    selectedItem: IUserCommunityUserEnrolling[]
    setOpenEditEnrollingForm: Dispatch<SetStateAction<boolean>>
    userName: string
}

const EditEnrollingForm = ({ params, userName, setOpenEditEnrollingForm, selectedItem }: IComponentProps) => {
    const [sais, setSais] = useState<ISai[]>([])
    const [sendingForm, setSendingForm] = useState<boolean>(false)
    const { toast } = useToast()
    const { data: session } = useSession()
    const dispatch = useDispatch()

    useEffect(() => {
        async function getSaisFn() {
            const { error, data, message } = await getSAIs()

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                    description: message,
                    duration: 5000
                })
            } else {
                setSais(data)
            }
        }
        getSaisFn()
    }, [toast])

    const methods = useForm<IFormInput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            enrolling_sai_id: String(selectedItem[0].sai.id),
            enrolling_date: selectedItem[0].enrolling_date,
            treatment_start_date: selectedItem[0].treatment_start_date,
            tester: selectedItem[0].tester,
            fapps_id: selectedItem[0].fapps_id
        }
    });

    const checkFappsIdFn = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const { value } = e.target
            if (value.length > 5 && value.length < 7) {
                const { error, data, message } = await getFappsIdById(Number(value));

                if (error) {
                    methods.setError("fapps_id", { message }, { shouldFocus: true })
                } else {
                    methods.clearErrors("fapps_id")
                }

            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                description: error,
                duration: 5000
            })
        }
    }

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setSendingForm(true)
        const newData = {
            ...data,
            id: selectedItem[0].id,
            treatment_start_date: data.treatment_start_date === undefined ? null : data.treatment_start_date,
            community_operation_user_id: params.id,
            user_id: session?.user.id,
            sai_id: session?.user.id_sai,
            from_username: session?.user.username,
            userName
        }

        const { error, data: resData, message } = await addCommunityOperationUserEnrolling(Array(newData))

        if (error) {
            toast({
                variant: "destructive",
                title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                description: message,
                duration: 5000
            })
        } else {
            if (resData === "exists") {
                methods.setError("fapps_id", { message }, { shouldFocus: true })
            } else {
                dispatch(setAddedUserProfile(resData))
                dispatch(setAddedCommunityOperationUserEnrolling([resData]))
                setOpenEditEnrollingForm(false)
                toast({
                    title: "Operativo Comunidad -> Perfil Usuario || " + appName,
                    description: message,
                    duration: 5000
                })
            }

        }
        setSendingForm(false)
    };

    return (
        <FormProvider {...methods}>
            <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                <div className='grid grid-cols-2 grid-rows-3 gap-4'>
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
                                                                sais.length === 0 ? <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> :
                                                                    <SelectGroup>
                                                                        {
                                                                            sais.map((sai) => sai.type.toLowerCase() === "SAI" || sai.type === "SAI" && <SelectItem key={sai.id} value={String(sai.id)}>{sai.name}</SelectItem>)
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
                                        render={({ field: { onChange, value } }) => {
                                            let date
                                            const isDateValid = isValid(parseISO(String(value)))
                                            if (isDateValid) {
                                                date = parseISO(String(value))
                                            } else {
                                                date = new Date()
                                            }

                                            return (
                                                <Popover modal>
                                                    <PopoverTrigger asChild>
                                                        <div className="space-y-2">
                                                            <Label htmlFor={field.name}>{field.label}</Label>
                                                            <div className="relative">
                                                                <Input
                                                                    type="text"
                                                                    className="border cursor-pointer"
                                                                    readOnly
                                                                    value={isDateValid ? format(date, 'dd/MM/yy') : "Seleccionar"}
                                                                />
                                                                <Icon name="CalendarIcon" className='absolute right-0 me-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                                            </div>
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={date}
                                                            onSelect={(date) => onChange(date?.toISOString())}
                                                            startMonth={new Date(2015, 0)}
                                                            endMonth={new Date(2024, 11)}
                                                            defaultMonth={date}
                                                            footer={
                                                                // Mostrar solo este boton a los campos que no son obligatorios
                                                                field.name === "treatment_start_date" &&
                                                                <Button variant="ghost" onClick={() => onChange(null)}>Limpiar</Button>
                                                            }
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }}
                                    /> : <div className="space-y-2">
                                        <Label htmlFor={field.name}>{field.label}</Label>
                                        <div className="relative">
                                            <Input
                                                {...methods.register(field.name as keyof IFormInput)}
                                                type={field.type}
                                                className="border"
                                                onChange={field.name === "fapps_id" ? checkFappsIdFn : () => { }}
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

export default EditEnrollingForm