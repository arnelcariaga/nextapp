"use client";
import { ChangeEvent } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/lib/schemas/form-schema";
import { getFappsIdByPatientId } from "@/lib/seed";
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo";

interface RecordDetailsProps {
  form: UseFormReturn<FormValues>;
}

export default function RecordDetails({ form }: RecordDetailsProps) {
  const { toast } = useToast()

  const checkFappsIdFn = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const { value } = e.target
      if (value.length > 5 && value.length < 7) {
        const { error, data, message } = await getFappsIdByPatientId(Number(value));

        if (error) {
          form.setError("fapps_id", { message }, { shouldFocus: true })
        } else {
          form.clearErrors("fapps_id")
        }

      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Pacientes -> Agregar || " + appName,
        description: error,
        duration: 5000
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="expedient"
        render={({ field }) => (
          <FormItem>
            <FormLabel>No. Expediente</FormLabel>
            <FormControl>
              <Input type='number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="record"
        render={({ field }) => (
          <FormItem>
            <FormLabel>No. Record</FormLabel>
            <FormControl>
              <Input type='number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='fapps_id'
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID FAPPS</FormLabel>
            <FormControl>
              <Input type='number' onChangeCapture={(val: ChangeEvent<HTMLInputElement>) => checkFappsIdFn(val)} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="clinic_entry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entrada a cl&aacute;nica</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">SAI</SelectItem>
                <SelectItem value="2">Comunidad</SelectItem>
                <SelectItem value="3">Otros SAIs</SelectItem>
                <SelectItem value="4">Sin identificar</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}