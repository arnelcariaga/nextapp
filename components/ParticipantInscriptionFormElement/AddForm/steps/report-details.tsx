"use client";
import { ChangeEvent, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/lib/schemas/liss-participant-inscription-form-schema";
import { getUniqueNumber } from "@/lib/seed";
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Calendar from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import Icon from "@/components/Icon";

interface RecordDetailsProps {
  form: UseFormReturn<FormValues>;
}

export default function ReportDetails({ form }: RecordDetailsProps) {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false)
  const { toast } = useToast()

  const checkUniqueNumberFn = async (value: string) => {
    try {
      if (value.length > 5 && value.length < 8) {
        const { error, message } = await getUniqueNumber(Number(value));

        if (error) {
          form.setError("unique_number", { message }, { shouldFocus: true })
          form.setValue('unique_number', '')
        } else {
          form.clearErrors("unique_number")
        }

      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Formulario inscripción de participantes -> Agregar || " + appName,
        description: error,
        duration: 5000
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="report_year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>A&ntilde;o de reporte</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">A&ntilde;o 1</SelectItem>
                <SelectItem value="2">A&ntilde;o 2</SelectItem>
                <SelectItem value="3">A&ntilde;o 3</SelectItem>
                <SelectItem value="4">A&ntilde;o 4</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='unique_number'
        render={({ field }) => (
          <FormItem>
            <FormLabel>No. &uacute;nico</FormLabel>
            <FormControl>
              <Input onChange={(e) => {
                const { value } = e.target
                field.onChange(value)
                checkUniqueNumberFn(value)
              }}
                value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="report_date"
        render={({ field }) => {
          let defaultDate
          if (field.value) {
            defaultDate = parseISO(field.value)
          }

          return (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
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
                        <span className="text-white">Seleccionar</span>
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
                        setOpenCalendar(!openCalendar)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  );
}