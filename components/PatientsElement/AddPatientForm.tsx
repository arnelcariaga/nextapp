"use client"
import { useForm, FormProvider } from "react-hook-form";
import { z, ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "../ui/select";
import { Label } from "../ui/label";
import StepsIndicator from "../StepsIndicator";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"

// Steps structure
const steps = [
    {
        stepName: "Registro Expediente",
        fields: [
            { name: "expedient", label: "No. Expediente", type: "text" },
            { name: "record", label: "No. Record", type: "text", validation: { required: "El No. Record es obligatorio" } },
            { name: "id_fapps", label: "ID FAPPS", type: "text", validation: { required: "El ID FAPPS es obligatorio" } },
            { name: "clinic_entry", label: "Entrada a Clínica", type: "select", options: ["Opción 1", "Opción 2"], validation: { required: "La entrada a clínica es obligatoria" } }
        ]
    },
    {
        stepName: "Datos Personales",
        fields: [
            { name: "first_name", label: "Nombre", type: "text", validation: { required: "El nombre es obligatorio" } },
            { name: "last_name", label: "Apellido", type: "text", validation: { required: "El apellido es obligatorio" } },
            { name: "gender", label: "Sexo", type: "select", options: ["Masculino", "Femenino"], validation: { required: "El sexo es obligatorio" } },
            { name: "weight", label: "Peso LB", type: "number", validation: { required: "El peso es obligatorio" } },
            { name: "birthdate", label: "Fecha Nacimiento", type: "date", validation: { required: "La fecha de nacimiento es obligatoria" } },
            { name: "age", label: "Edad", type: "number", validation: { required: "La edad es obligatoria" } },
            { name: "age_range", label: "Rango de Edad", type: "text", validation: { required: "El rango de edad es obligatorio" } },
            { name: "nationality", label: "Nacionalidad", type: "select", options: ["Nacionalidad 1", "Nacionalidad 2"], validation: { required: "La nacionalidad es obligatoria" } },
            { name: "identity_document", label: "Documento Identidad", type: "text", validation: { required: "El documento de identidad es obligatorio" } }
        ]
    },
    {
        stepName: "Datos Demográficos",
        fields: [
            { name: "target_population", label: "Población Objetivo", type: "select", options: ["Opción 1", "Opción 2"], validation: { required: "La población objetivo es obligatoria" } },
            { name: "phone", label: "Teléfono", type: "tel", validation: { required: "El teléfono es obligatorio" } },
            { name: "phone2", label: "Teléfono 2", type: "tel" },
            { name: "characterization", label: "Caracterización", type: "text" },
            { name: "address", label: "Dirección", type: "text", validation: { required: "La dirección es obligatoria" } },
            { name: "province", label: "Provincia", type: "select", options: ["Provincia 1", "Provincia 2"], validation: { required: "La provincia es obligatoria" } },
            { name: "municipality", label: "Municipio", type: "select", options: ["Municipio 1", "Municipio 2"], validation: { required: "El municipio es obligatorio" } },
            { name: "sector", label: "Sector", type: "text" }
        ]
    },
    {
        stepName: "Datos Clínicos",
        fields: [
            { name: "diagnosticDate", label: "Fecha de Diagnóstico", type: "date", validation: { required: "Campo requerido" } },
            { name: "entryDate", label: "Fecha de Ingreso", type: "date", validation: { required: "Campo requerido" } },
            { name: "cvBasal", label: "CV Basal", type: "text", validation: { required: "El campo es obligatorio" } },
            { name: "cvBasalDate", label: "CV-Fecha Basal", type: "date", validation: { required: "Campo requerido" } },
            { name: "cd4Basal", label: "CD4 Basal", type: "text", validation: { required: "El campo es obligatorio" } },
            { name: "cd4BasalDate", label: "CD4-Fecha Basal", type: "date", validation: { required: "Campo requerido" } },
            { name: "arvInitDate", label: "ARV-Fecha de Inicio", type: "date", validation: { required: "Campo requerido" } },
            { name: "indexReferer", label: "Referido INDEX", type: "select", options: ["Provincia 1", "Provincia 2"], validation: { required: "La provincia es obligatoria" } },
            { name: "belongsToOBC", label: "Pertenece al Programa de OVC", type: "select", options: ["Provincia 1", "Provincia 2"], validation: { required: "La provincia es obligatoria" } },
        ]
    }
];

// Create dynamic schema with zod based in the steps
const createSchema = (step: any) => {
    const shape: any = {};
    step.fields.forEach((field: any) => {
        if (field.validation) {
            shape[field.name] = z.string().min(1, field.validation.required);
        }
    });
    return z.object(shape);
};

function MultiStepForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const step = steps[currentStep];

    const methods = useForm({
        resolver: zodResolver(createSchema(step) as ZodSchema),
    });

    const onSubmit = (data: any) => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log("Formulario enviado: ", data);
        }
    };

    return (
        <FormProvider {...methods}>
            <Card className="mx-5 mt-3 shadow">
                <CardHeader>
                    <StepsIndicator
                        steps={[
                            { label: "Registro Expediente", description: "" },
                            { label: "Datos Personales", description: "" },
                            { label: "Datos Demográficos", description: "" },
                            { label: "Datos Clínicos", description: "" }
                        ]}
                        currentStep={currentStep + 1}
                        style="mt-[2%]"
                    />
                </CardHeader>
                <CardContent>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="px-3 mt-[4%]">
                        <div
                            className={
                                `${currentStep === 0 ? "grid-cols-2 grid-rows-2" : currentStep === 2 ? "grid-cols-4 grid-rows-3" : "grid-cols-3 grid-rows-3"}
                     grid gap-4
                    `
                            }
                        >
                            {step.fields.map((field: any) => (
                                <div key={field.name}>
                                    {field.type === "select" ? (
                                        <div className="space-y-2">
                                            <Label htmlFor={field.name}>{field.label}</Label>
                                            <div className="relative">
                                                <Select
                                                    onValueChange={(value) => methods.setValue(field.name, value, { shouldValidate: true })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a fruit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {field.options.map((option: string, index: number) => (
                                                                <SelectItem key={index} value={option}>{option}</SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label htmlFor={field.name}>{field.label}</Label>
                                            <div className="relative">
                                                <Input
                                                    {...methods.register(field.name)}
                                                    type={field.type}
                                                    className="border"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {methods.formState.errors[field.name] && (
                                        <p className="text-red-500 text-sm">
                                            {methods.formState.errors[field.name]?.message as string}
                                        </p>
                                    )}
                                </div>
                            ))}

                        </div>

                        <div className="flex space-x-4 justify-end mt-[3%]">
                            {currentStep > 0 && (
                                <Button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                                    Anterior
                                </Button>
                            )}
                            <Button type="submit">{currentStep === steps.length - 1 ? "Enviar" : "Siguiente"}</Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </FormProvider>
    );
}

export default MultiStepForm;

