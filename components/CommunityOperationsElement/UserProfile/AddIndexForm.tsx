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
import { format } from 'date-fns';
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { appName } from '@/lib/appInfo';
import { getSAIs, addCommunityOperationUserEnrolling } from '@/lib/seed';
import { TCommunityOperativeUserParams } from '@/lib/types';
import { useSession } from 'next-auth/react';
import { ISai } from '@/lib/interfaces';
import { Textarea } from '@/components/ui/textarea';

interface IInputs {
  name: string
  label: string
  type: string
  validation?: { required: string }
}

interface IAddForm {
  sectionName: string
  fields: IInputs[]
}

interface IFormInput {
  fapps_id: number
  ofered: string
  accepted: string
  comments: string
  refered_date: string
  ofered_date: string;
  accepted_date: string;
  test_result: string;
  refered_fapps_id: number;
  refered_name: string;
  refered_last_name: string;
  refered_age: number;
  referal_related_initial_index: string;
  referal_gender: string;
  priority_poblation: string;
  key_population: string;
  date_test_made: string;
  enrolling_date: string;
  treatment_start_date: string;
  tracking_date: string;
  enrolling_type_id: string;
}

const formInputs: IAddForm[] = [{
  sectionName: "INDEX Inicial",
  fields: [
    { name: "fapps_id", label: "IDFAPPS", type: "number" },
    { name: "ofered", label: "Ofrecido", type: "select" },
    { name: "accepted", label: "Aceptado", type: "select" },
    { name: "refered_date", label: "Fecha Referimiento (Cont. Ref.)", type: "date" },
    { name: "ofered_date", label: "Fecha Ofrecido", type: "date" },
    { name: "accepted_date", label: "Fecha Aceptado", type: "date" },
    { name: "comments", label: "Comentarios", type: "textarea" }
  ]
}, {
  sectionName: "Contacto Referido",
  fields: [
    { name: "test_result", label: "Resultado de Prueba", type: "select" },
    { name: "refered_fapps_id", label: "ID FAPPS", type: "number" },
    { name: "refered_name", label: "Nombre(s)", type: "text" },
    { name: "refered_last_name", label: "Apellido(s)", type: "text" },
    { name: "refered_age", label: "Edad", type: "number" },
    { name: "referal_related_initial_index", label: "Relación Index Inicial", type: "select" },
    { name: "referal_gender", label: "Sexo", type: "select" },
    { name: "priority_poblation", label: "Población Priorizada", type: "select" },
    { name: "key_population", label: "Población Clave", type: "select" },
    { name: "date_test_made", label: "Fecha Prueba Realizada", type: "date" },
    { name: "enrolling_date", label: "Fecha de Enrolamiento", type: "date" },
    { name: "treatment_start_date", label: "Fecha de Inicio de Tratamiento", type: "date" },
    { name: "tracking_date", label: "Fecha de Seguimiento", type: "date" },
    { name: "enrolling_type_id", label: "Causa de No Enrolamiento", type: "select" },
  ]
}];

const formSchema = z.object({
  fapps_id: z.coerce.number().min(1, { message: "ID FAPPS requerido" }),
  ofered: z.string().min(1, { message: "Campo requerido" }),
  accepted: z.string().min(1, { message: "Campo requerido" }),
  refered_date: z.date().optional(),
  ofered_date: z.date().optional(),
  accepted_date: z.date().optional(),
  comments: z.string().min(1, { message: "Campo requerido" }),

  //Refered Contact section
  test_result: z.string().optional(),
  refered_fapps_id: z.coerce.number().optional(),
  refered_name: z.string().optional(),
  refered_last_name: z.string().optional(),
  refered_age: z.coerce.number().optional(),
  referal_related_initial_index: z.string().optional(),
  referal_gender: z.string().optional(),
  priority_poblation: z.string().optional(),
  key_population: z.string().optional(),
  date_test_made: z.date().optional(),
  enrolling_date: z.date().optional(),
  treatment_start_date: z.date().optional(),
  tracking_date: z.date().optional(),
  enrolling_type_id: z.string().optional(),
}).superRefine((data, ctx) => {

  if (data.ofered === "1" && data.accepted === "1") {
    const requiredFields: Array<keyof IFormInput> = ['refered_date', 'accepted_date', 'refered_fapps_id'];

    requiredFields.forEach(field => {
      if (!data[field]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Campo requerido",
          path: [field],
        });
      }
    });
  }

  if (data.ofered === '1' && !data.ofered_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Campo requerido",
      path: ["ofered_date"],
    });
  }

});

interface IComponentProps extends TCommunityOperativeUserParams {
  userName: string
  setCountEnrolling: Dispatch<SetStateAction<number>>
  setOpenAddIndexForm: Dispatch<SetStateAction<boolean>>
  userFappId: number
}

const AddIndexForm = ({ params, userName, setCountEnrolling, setOpenAddIndexForm, userFappId }: IComponentProps) => {
  const [sais, setSais] = useState<ISai[]>([])
  const [sendingForm, setSendingForm] = useState<boolean>(false)
  const { toast } = useToast()
  const { data: session } = useSession()

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
      fapps_id: userFappId
    }
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    // setSendingForm(true)

    // const newData = {
    //   ...data,
    //   community_operation_user_id: params.id,
    //   user_id: session?.user.id,
    //   sai_id: session?.user.id_sai,
    //   from_username: session?.user.username,
    //   userName
    // }

    // const { error, data: resData, message } = await addCommunityOperationUserEnrolling(Array(newData))

    // if (error) {
    //   toast({
    //     variant: "destructive",
    //     title: "Operativo Comunidad -> Perfil Usuario || " + appName,
    //     description: message,
    //     duration: 5000
    //   })
    // } else {
    //   setCountEnrolling(resData)
    //   setOpenAddIndexForm(false)
    //   toast({
    //     title: "Operativo Comunidad -> Perfil Usuario || " + appName,
    //     description: message,
    //     duration: 5000
    //   })
    // }
    // setSendingForm(false)
  };

  const oferedVal = methods.watch("ofered")
  const acceptedVal = methods.watch("accepted")
  const shouldShowOtherFields = oferedVal === "1" && acceptedVal === "1";
  const shouldShowOferedDateField = oferedVal === '1';

  return (
    <FormProvider {...methods}>
      <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {formInputs.map((ele) => {
          return <div className='space-y-4' key={ele.sectionName}>
            {
              shouldShowOtherFields &&
              <>
                <p className='text-lg font-bold bg-green-950 p-1 px-3'>{ele.sectionName}</p>
                <hr />
              </>
            }
            <div className={`grid ${shouldShowOtherFields ? "grid-cols-4" : "grid-cols-2"} grid-rows-1 gap-4`}>
              {
                ele.fields.map((field) => {
                  const isInitiallyHidden = !["fapps_id", "ofered", "accepted", "comments"].includes(field.name);
                  const shouldHideField = isInitiallyHidden && !shouldShowOtherFields && !(field.name === "ofered_date" && shouldShowOferedDateField);

                  if (shouldHideField) return null;


                  return <div key={field.name}>
                    {
                      field.type === "select" ? (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>{field.label}</Label>
                          <div className="relative">
                            <Select
                              onValueChange={(value) => {
                                methods.setValue(field.name as keyof IFormInput, value, { shouldValidate: true })
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {
                                  field.name === "ofered" || field.name === "accepted" ?
                                    <SelectGroup>
                                      <SelectItem value="1">Si</SelectItem>
                                      <SelectItem value="2">No</SelectItem>
                                    </SelectGroup> :
                                    null
                                }
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
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
                                      value={value ? format(value, "d/M/yyyy") : "Seleccionar"}
                                    />
                                    <Icon name="CalendarIcon" className='absolute right-0 me-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                  </div>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={new Date(value as keyof IFormInput)}
                                  onSelect={onChange}
                                  startMonth={new Date(1930, 0)}
                                  endMonth={new Date(2013, 11)}
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        /> : field.type === "textarea" ?
                          <div className="space-y-2">
                            <Label htmlFor={field.name}>{field.label}</Label>
                            <div className="relative">
                              <Textarea
                                {...methods.register(field.name as keyof IFormInput)}
                                className="border"
                              />
                            </div>
                          </div>
                          : <div className="space-y-2">
                            <Label htmlFor={field.name}>{field.label}</Label>
                            <div className="relative">
                              <Input
                                {...methods.register(field.name as keyof IFormInput)}
                                type={field.type}
                                className="border"
                                disabled={field.name === "fapps_id"}
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
                })
              }
            </div>
          </div>
        })}
        <Button type="submit" className="w-full group bg-green-600 dark:bg-green-900" disabled={sendingForm}>
          {
            sendingForm && <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
          }
          <span className='text-white'>Guardar</span>
          <Icon name="Save" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-white" />
        </Button>
      </form>
    </FormProvider >
  )
}

export default AddIndexForm