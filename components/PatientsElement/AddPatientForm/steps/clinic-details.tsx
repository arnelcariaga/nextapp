"use client";
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/lib/schemas/form-schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Icon from "@/components/Icon";
import Calendar from "@/components/Calendar";
import { format, parseISO } from "date-fns";

interface ClinicDetailsProps {
  form: UseFormReturn<FormValues>;
}

const tasks = [
  { id: "web-development", label: "Web Development", description: "Frontend and backend development" },
  { id: "mobile-apps", label: "Mobile Apps", description: "iOS and Android development" },
  { id: "ui-design", label: "UI Design", description: "User interface and experience design" },
  { id: "data-analysis", label: "Data Analysis", description: "Data processing and visualization" },
  { id: "cloud-services", label: "Cloud Services", description: "AWS, Azure, and GCP solutions" },
  { id: "devops", label: "DevOps", description: "CI/CD and infrastructure automation" },
  { id: "security", label: "Security", description: "Application and network security" },
  { id: "testing", label: "Testing", description: "QA and automated testing" },
  { id: "api-integration", label: "API Integration", description: "RESTful and GraphQL APIs" },
  { id: "database", label: "Database", description: "SQL and NoSQL database management" },
  { id: "ml-ai", label: "ML/AI", description: "Machine learning and AI development" },
  { id: "blockchain", label: "Blockchain", description: "Web3 and smart contracts" }
] as const;

export default function ClinicDetails({ form }: ClinicDetailsProps) {
  const [openCalendars, setOpenCalendars] = useState<{ [key: string]: boolean }>({});

  const toggleCalendar = (fieldName: keyof FormValues) => {
    setOpenCalendars((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleSelectDate = (formattedDate: string, fieldName: keyof FormValues) => {
    form.setValue(fieldName, formattedDate, { shouldValidate: true });
    setOpenCalendars((prev) => ({ ...prev, [fieldName]: false }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="diagnosticDate"
        render={({ field }) => {
          let defaultDate
          if (field.value) {
            defaultDate = parseISO(field.value)
          }

          return (
            <FormItem>
              <FormLabel>Fecha de diagnóstico</FormLabel>
              <Popover open={openCalendars['diagnosticDate']} onOpenChange={() => toggleCalendar("diagnosticDate")}>
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
                        handleSelectDate(formattedDate, "diagnosticDate")
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

      <FormField
        control={form.control}
        name="entryDate"
        render={({ field }) => {
          let defaultDate
          if (field.value) {
            defaultDate = parseISO(field.value)
          }

          return (
            <FormItem>
              <FormLabel>Fecha de Ingreso</FormLabel>
              <Popover open={openCalendars['entryDate']} onOpenChange={() => toggleCalendar("entryDate")}>
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
                        handleSelectDate(formattedDate, "entryDate")
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

      <FormField
        control={form.control}
        name='vcBasal'
        render={({ field }) => (
          <FormItem>
            <FormLabel>CV Basal</FormLabel>
            <FormControl>
              <Input type='number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="vcBasalDate"
        render={({ field }) => {
          let defaultDate
          if (field.value) {
            defaultDate = parseISO(field.value)
          }

          return (
            <FormItem>
              <FormLabel>CV Basal - Fecha</FormLabel>
              <Popover open={openCalendars['vcBasalDate']} onOpenChange={() => toggleCalendar("vcBasalDate")}>
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
                        handleSelectDate(formattedDate, "vcBasalDate")
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

      <FormField
        control={form.control}
        name='cd4Basal'
        render={({ field }) => (
          <FormItem>
            <FormLabel>CD4 Basal</FormLabel>
            <FormControl>
              <Input type='number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cd4BasalDate"
        render={({ field }) => {
          let defaultDate
          if (field.value) {
            defaultDate = parseISO(field.value)
          }

          return (
            <FormItem>
              <FormLabel>CD4 Basal - Fecha</FormLabel>
              <Popover open={openCalendars['cd4BasalDate']} onOpenChange={() => toggleCalendar("cd4BasalDate")}>
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
                        handleSelectDate(formattedDate, "cd4BasalDate")
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

      <FormField
        control={form.control}
        name="arvStartDate"
        render={({ field }) => {
          let defaultDate
          if (field.value) {
            defaultDate = parseISO(field.value)
          }

          return (
            <FormItem>
              <FormLabel>ARV - Fecha inicio</FormLabel>
              <Popover open={openCalendars['arvStartDate']} onOpenChange={() => toggleCalendar("arvStartDate")}>
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
                        handleSelectDate(formattedDate, "arvStartDate")
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

      <FormField
        control={form.control}
        name='indexReferer'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Referido INDEX</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Si</SelectItem>
                <SelectItem value="2">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='belongsToOBC'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pertenece al programa de OVC</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Si</SelectItem>
                <SelectItem value="2">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}