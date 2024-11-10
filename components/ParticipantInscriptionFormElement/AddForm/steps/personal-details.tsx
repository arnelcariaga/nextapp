"use client";
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/lib/schemas/liss-participant-inscription-form-schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Calendar from "@/components/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import Icon from "@/components/Icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IProvinces, IMunicipalities } from "@/lib/interfaces";
import { getProvinces, getMunicipalities } from "@/lib/seed";
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo";
import calculateAge from "@/lib/calculateAge";

interface PersonalDetailsProps {
  form: UseFormReturn<FormValues>;
}

export default function PersonalDetails({ form }: PersonalDetailsProps) {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false)
  const [provinces, setProvinces] = useState<IProvinces[]>([])
  const [loadingData, setLoadingData] = useState<boolean>(true)
  const [municipalities, setMunicipalities] = useState<IMunicipalities[]>([]);

  const { toast } = useToast()
  const provinceInput = form.watch('province');
  const dateOfBirthInput = form.watch('dateOfBirth');

  // Load provinces
  useEffect(() => {
    async function getProvincesFn() {
      const { error, data, message } = await getProvinces()

      if (error) {
        toast({
          variant: "destructive",
          title: "Formulario inscripción de participantes -> Agregar || " + appName,
          description: message,
          duration: 5000
        })
      } else {
        setProvinces(data)
      }
      setLoadingData(false)
    }
    getProvincesFn()
  }, [toast])

  // On province input change
  useEffect(() => {
    async function getMunicipalitiesFn() {
      if (provinceInput) {
        const { error, data: resData, message } = await getMunicipalities(Number(provinceInput))

        if (error) {
          toast({
            variant: "destructive",
            title: "Formulario inscripción de participantes -> Agregar || " + appName,
            description: message,
            duration: 5000
          })
        } else {
          setMunicipalities(resData)
        }
        setLoadingData(false)
      }
    }
    getMunicipalitiesFn()
  }, [provinceInput, toast]);

  // On dateOfBirth input change
  useEffect(() => {
    if (dateOfBirthInput) {
      form.setValue('age', String(calculateAge(dateOfBirthInput)));
    }
  }, [dateOfBirthInput, form]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apellido(s)</FormLabel>
            <FormControl>
              <Input placeholder="Doe" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormItem className="flex items-center space-y-0 space-x-3">
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => {
            let defaultDate
            if (field.value) {
              defaultDate = parseISO(field.value)
            }

            return (
              <FormItem className="w-[75%]">
                <FormLabel>Fecha de nacimiento</FormLabel>
                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal h-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(String(defaultDate), "dd/MM/yy")
                        ) : (
                          <span>Seleccionar</span>
                        )}
                        <Icon name="CalendarIcon" className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={defaultDate}
                      defaultMonth={defaultDate}
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, "yyyy-MM-dd")
                          field.onChange(formattedDate)
                          setOpenCalendar(false)
                        }
                      }}
                      endMonth={new Date(2018, 11)}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem className="w-[25%]">
              <FormLabel>Edad</FormLabel>
              <FormControl>
                <Input type="number" {...field} value={field.value || ""} onChange={(e) => {
                  const { value } = e.target
                  field.onChange(value)
                  if (dateOfBirthInput) {
                    if (Number(value) !== calculateAge(dateOfBirthInput)) {
                      form.setValue('dateOfBirth', '')
                    }
                  }
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormItem>
      <FormField
        control={form.control}
        name="identity_document"
        render={({ field }) => (
          <FormItem>
            <FormLabel>C&eacute;dula</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sexo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Var&oacute;n</SelectItem>
                <SelectItem value="2">Hembra</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>G&eacute;nero</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Masculino</SelectItem>
                <SelectItem value="2">Femenino</SelectItem>
                <SelectItem value="3">Trans</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo electr&oacute;nico</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tel&eacute;fono</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="have_whatsapp"
        render={({ field }) => (
          <FormItem className="items-center mt-6">
            <FormLabel>Whatsapp?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-3"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="1" />
                  </FormControl>
                  <FormLabel className="font-normal">Si</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="2" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="marital_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado civil</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Soltero</SelectItem>
                <SelectItem value="2">Casado</SelectItem>
                <SelectItem value="3">Uni&oacute;n libre</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provincia</FormLabel>
            <Select onValueChange={(val) => {
              field.onChange(val)
              form.setValue("municipality", "select");
            }} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {
                  loadingData ? <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> :
                    provinces.map(({ id, name }) => (
                      <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="municipality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Municipio</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='select'>Seleccionar</SelectItem>
                {
                  loadingData ? <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> :
                    municipalities.map(({ id, name }) => (
                      <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Calle</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="community"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Comunidad</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}