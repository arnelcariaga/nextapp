"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { formSchema, type FormValues } from "@/lib/schemas/form-schema";
import RecordDetails from "./steps/record-details";
import PersonalDetails from "./steps/personal-details";
import DemographicDetails from "./steps/demographic-details";
import ClinicDetails from "./steps/clinic-details";
import StepsIndicator from "@/components/StepsIndicator";
import Icon from "@/components/Icon";
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo";
import { useRouter } from "next/navigation";
import { addPatient } from "@/lib/seed";

const steps = [
    {
        id: 1,
        name: "Registro expediente",
        fields: ["clinic_entry", "expedient", "record", "fapps_id"],
    },
    {
        id: 2,
        name: "Datos personales",
        fields: ["name", "lastName", "gender", "weight", "dateOfBirth", "age", "age_range", "nationality", "identity_document"],
    },
    {
        id: 3,
        name: "Datos demográficos",
        fields: ["target_population", "phone", "phone2", 'characterization', 'address', 'province', 'municipality', 'sector'],
    },
    {
        id: 4,
        name: "Datos clínicos",
        fields: ['diagnosticDate', 'entryDate', 'vcBasal', 'vcBasalDate', 'cd4Basal', 'cd4BasalDate', 'arvStartDate', 'indexReferer', 'belongsToOBC'],
    },
];

export default function AddPatientForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [sendingForm, setSendingForm] = useState<boolean>(false)
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clinic_entry: undefined,
            expedient: "",
            record: "",
            fapps_id: "",
            name: "",
            lastName: "",
            gender: undefined,
            weight: "",
            dateOfBirth: "",
            age: "",
            age_range: "",
            nationality: undefined,
            identity_document: "",
            target_population: undefined,
            phone: "",
            phone2: "",
            characterization: [],
            address: "",
            province: undefined,
            municipality: undefined,
            sector: "",
            diagnosticDate: "",
            entryDate: "",
            vcBasal: "",
            vcBasalDate: "",
            cd4Basal: "",
            cd4BasalDate: "",
            arvStartDate: "",
            indexReferer: undefined,
            belongsToOBC: undefined
        },
        mode: "onChange",
    });

    const validateCurrentStep = async () => {
        const currentFields = steps[currentStep - 1].fields;
        const result = await form.trigger(currentFields as any);
        return result;
    };

    const handleNext = async () => {
        const isValid = await validateCurrentStep();
        if (isValid) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    async function onSubmit(data: FormValues) {
        setSendingForm(true)
console.log(data);

        // const newData = {
        //     ...data
        // }
        // const { error, data: resData, message } = await addPatient(Array(newData))

        // if (error) {
        //     toast({
        //         variant: "destructive",
        //         title: "Pacientes -> Agregar || " + appName,
        //         description: message,
        //         duration: 5000
        //     })
        //     setSendingForm(false)

        // } else {
        //     form.reset();
        //     toast({
        //         title: "Pacientes -> Agregar || " + appName,
        //         description: message,
        //         duration: 5000
        //     })
        //     router.push(`/patients`)
        // }
        setSendingForm(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 px-4 sm:px-6 lg:px-8">
            <div className="w-full mx-auto">
                <StepsIndicator
                    steps={steps.map(step => ({
                        id: step.id,
                        label: step.name
                    }))}
                    currentStep={currentStep}
                    style="mb-5"
                />

                <Card className="p-6 shadow-lg">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {currentStep === 1 && <RecordDetails form={form} />}
                            {currentStep === 2 && <PersonalDetails form={form} />}
                            {currentStep === 3 && <DemographicDetails form={form} />}
                            {currentStep === 4 && <ClinicDetails form={form} />}

                            <div className="flex justify-between pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    type="button"  // Cambiar "submit" a "button" para evitar el envío automático
                                    onClick={async () => {
                                        if (currentStep === steps.length) {
                                            const isLastStepValid = await validateCurrentStep();
                                            if (isLastStepValid) {
                                                // Realiza el envío del formulario solo si la validación es exitosa
                                                form.handleSubmit(onSubmit)();
                                            }
                                        } else {
                                            await handleNext();
                                        }
                                    }}
                                    className={`${currentStep === steps.length && "bg-green-600 dark:bg-green-900 text-white"}`}
                                    disabled={sendingForm}
                                >
                                    {currentStep < steps.length ? (
                                        <>
                                            Siguiente
                                            <Icon name="ChevronRight" className="ml-2 h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            Guardar
                                            {
                                                sendingForm ? <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" /> :
                                                    <Icon name="Save" className="ml-2 h-4 w-4" />
                                            }
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    );
}