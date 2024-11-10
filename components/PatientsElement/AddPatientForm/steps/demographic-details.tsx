"use client";
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/lib/schemas/form-schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Icon from "@/components/Icon";

interface DemographicDetailsProps {
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

export default function DemographicDetails({ form }: DemographicDetailsProps) {
  const [open, setOpen] = useState(false);
  const selectedTasks = form.watch("characterization") || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name='target_population'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Poblaci&oacute;n objetivo</FormLabel>
            <Select onValueChange={field.onChange}>
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
        name="phone2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tel&eacute;fono 2</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="characterization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Caracterización</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between mt-4 h-auto min-h-[2.5rem] px-3 py-2"
                  >
                    <div className="flex flex-wrap gap-1 pe-8 font-normal">
                      {selectedTasks.length === 0 && "Seleccionar"}
                      {selectedTasks.map((tagId) => {
                        const task = tasks.find((t) => t.id === tagId);
                        return (
                          <Badge
                            key={tagId}
                            variant="secondary"
                            className="px-2 py-0.5 flex items-center gap-1"
                          >
                            <span>{task?.label}</span>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(selectedTasks.filter((t) => t !== tagId));
                              }}
                            >
                              <Icon name="X" className="h-3 w-3" />
                              <span className="sr-only">Eliminar {task?.label}</span>
                            </div>
                          </Badge>
                        );
                      })}
                    </div>
                    <Icon name="ChevronsUpDown" className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {tasks.map((task) => (
                          <CommandItem
                            key={task.id}
                            onSelect={() => {
                              const currentValue = field.value || [];
                              const newValue = currentValue.includes(task.id)
                                ? currentValue.filter((i) => i !== task.id)
                                : [...currentValue, task.id];
                              field.onChange(newValue);
                            }}
                            className="flex items-start py-2"
                          >
                            <div className="flex items-center h-6">
                              <Icon name="Check"
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value?.includes(task.id) ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </div>
                            <div>
                              <div className="font-medium">{task.label}</div>
                              <div className="text-sm text-muted-foreground">{task.description}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Direcci&oacute;n</FormLabel>
            <FormControl>
              <Input placeholder="C/ Espinosa, Villas Agrícolas #4" {...field} value={field.value || ""} />
            </FormControl>
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
        name="sector"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sector</FormLabel>
            <FormControl>
              <Input placeholder="Villas Agrícolas" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}