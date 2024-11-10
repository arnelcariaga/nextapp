"use client";
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/lib/schemas/form-schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Calendar from "@/components/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, differenceInYears, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import Icon from "@/components/Icon";
import { getNationalities } from "@/lib/seed";

interface PersonalDetailsProps {
  form: UseFormReturn<FormValues>;
}

export default function PersonalDetails({ form }: PersonalDetailsProps) {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false)

  const calculateAge = (date: string) => {
    const currentDate = new Date();
    const birthDateObj = new Date(date);
    return differenceInYears(currentDate, birthDateObj)
  };

  function getAgeRange(date: string) {
    if (calculateAge(date) <= 14) return "0 - 14";
    if (calculateAge(date) <= 19) return "15 - 19";
    if (calculateAge(date) <= 24) return "20 - 24";
    if (calculateAge(date) <= 29) return "25 - 29";
    if (calculateAge(date) <= 34) return "30 - 34";
    if (calculateAge(date) <= 39) return "35 - 39";
    if (calculateAge(date) <= 44) return "40 - 44";
    if (calculateAge(date) <= 49) return "45 - 49";
    return "Mayor de 50";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <FormField
        control={form.control}
        name="gender"
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
                <SelectItem value="1">Masculino</SelectItem>
                <SelectItem value="2">Femenino</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Peso LB</FormLabel>
            <FormControl>
              <Input type="number" placeholder="150" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => {
          let defaultDate
          if (field.value) {
            defaultDate = parseISO(field.value)
          }

          return (
            <FormItem>
              <FormLabel>Fecha de nacimiento</FormLabel>
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
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
                        form.setValue("age", String(calculateAge(formattedDate)), { shouldValidate: true })
                        form.setValue("age_range", String(getAgeRange(formattedDate)), { shouldValidate: true })
                        setOpenCalendar(!openCalendar)
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
          <FormItem>
            <FormLabel>Edad</FormLabel>
            <FormControl>
              <Input type="number" disabled {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age_range"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rango de edad</FormLabel>
            <FormControl>
              <Input disabled {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="nationality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nacionalidad</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="mr">Mr.</SelectItem>
                <SelectItem value="mrs">Mrs.</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="identity_document"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Documento de indentidad</FormLabel>
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