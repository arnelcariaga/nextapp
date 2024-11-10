"use client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/lib/schemas/liss-participant-inscription-form-schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface DemographicDetailsProps {
  form: UseFormReturn<FormValues>;
}

const days = [
  { id: "1", label: "Lunes" },
  { id: "2", label: "Martes" },
  { id: "3", label: "Miércoles" },
  { id: "4", label: "Jueves" },
  { id: "5", label: "Viernes" },
  { id: "6", label: "Sábado" },
  { id: "7", label: "Domingo" }
] as const;

const schedules = [
  { id: "1", label: "8:00AM -12:00 AM" },
  { id: "2", label: "1:00PM - 05:00 PM" },
  { id: "3", label: "06:00 PM" }
] as const;

export default function QuestionsDetails({ form }: DemographicDetailsProps) {
  const have_disability_input = form.watch("have_disability") || '';
  const disability_type_input = form.watch("disability_type") || '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        control={form.control}
        name='workshop_participating_quality'
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿En qu&eacute; calidad est&aacute;n participando en el taller?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Persona con discapacidad</SelectItem>
                <SelectItem value="2">Familiar/Acompa&ntilde;ante de mujer con discapacidad</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="have_disability"
        render={({ field }) => (
          <FormItem className="items-center mt-6">
            <FormLabel>¿Tienes alg&uacute;n tipo de discapacidad?</FormLabel>
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
      {
        have_disability_input === '1' &&
        <FormField
          control={form.control}
          name="disability_type"
          render={({ field }) => (
            <FormItem className="items-center mt-6">
              <FormLabel>Tipo de discapacidad</FormLabel>
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
                    <FormLabel className="font-normal">Visual</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal">Motriz</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                    <FormLabel className="font-normal">Auditiva</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                    <FormLabel className="font-normal">Otra</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5" />
                    </FormControl>
                    <FormLabel className="font-normal">Ninguna</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
      {
        // OJO, depende si selecciona OTRA en disability_type
        disability_type_input === '4' &&
        <FormField
          control={form.control}
          name="another_disability_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especificar</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      }
      <FormField
        control={form.control}
        name="is_studying"
        render={({ field }) => (
          <FormItem className="items-center mt-6">
            <FormLabel>¿Estas estudiando actualmente?</FormLabel>
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
        name="last_education_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>&Uacute;ltimo nivel educativo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">B&aacute;sica</SelectItem>
                <SelectItem value="2">Secundaria</SelectItem>
                <SelectItem value="3">T&eacute;cnica</SelectItem>
                <SelectItem value="4">Universitaria</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="is_working"
        render={({ field }) => (
          <FormItem className="items-center mt-6">
            <FormLabel>¿Estas laborando?</FormLabel>
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
        name="available_days"
        render={() => (
          <FormItem className="md:col-span-1 space-y-4">
            <FormLabel>D&iacute;as disponibles</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {days.map((interest) => (
                <FormField
                  key={interest.id}
                  control={form.control}
                  name="available_days"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={interest.id}
                        className="flex items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(interest.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              const newValue = checked
                                ? [...currentValue, interest.id]
                                : currentValue.filter((value) => value !== interest.id);
                              field.onChange(newValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {interest.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="available_schedule_for_participate_training"
        render={() => (
          <FormItem className="md:col-span-2 space-y-4">
            <FormLabel>¿Cu&aacute;l horarios tienes disponible para participar de las formaciones?</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3">
              {schedules.map((interest) => (
                <FormField
                  key={interest.id}
                  control={form.control}
                  name="available_schedule_for_participate_training"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={interest.id}
                        className="flex items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(interest.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              const newValue = checked
                                ? [...currentValue, interest.id]
                                : currentValue.filter((value) => value !== interest.id);
                              field.onChange(newValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {interest.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="topics_to_be_trained"
        render={({ field }) => (
          <FormItem>
            <FormLabel>¿En cuales temas te gustar&iacute;a ser formado?	</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="permission_for_taking_photos_videos"
        render={({ field }) => (
          <FormItem className="items-center mt-6">
            <FormLabel>Firmo el consentimiento informado para toma de foto y video</FormLabel>
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
    </div>
  );
}