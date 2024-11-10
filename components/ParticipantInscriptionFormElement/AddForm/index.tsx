"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { formSchema, type FormValues } from "@/lib/schemas/liss-participant-inscription-form-schema";
import ReportDetails from "./steps/report-details";
import PersonalDetails from "./steps/personal-details";
import QuestionsDetails from "./steps/questions-details";
import StepsIndicator from "@/components/StepsIndicator";
import Icon from "@/components/Icon";
import { useToast } from "@/hooks/use-toast"
import { appName } from "@/lib/appInfo";
import { useRouter } from "next/navigation";
import { addParticipantInscriptionForm } from "@/lib/seed";
import { useSession } from 'next-auth/react'

const steps = [
    {
        id: 1,
        name: "Reporte",
        fields: ["report_year", "unique_number", "report_date"],
    },
    {
        id: 2,
        name: "Datos personales",
        fields: ["name", "lastName", "gender", "dateOfBirth", "age", "sex", "province", "municipality", "street", 'community', 'phone', 'have_whatsapp', 'identity_document', 'email', 'marital_status'],
    },
    {
        id: 3,
        name: "Preguntas",
        fields: ["workshop_participating_quality", "have_disability", "disability_type", 'another_disability_type', 'is_studying', 'last_education_level', 'is_working', 'available_days', 'available_schedule_for_participate_training', 'topics_to_be_trained', 'permission_for_taking_photos_videos'],
    },
];

export default function AddForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [sendingForm, setSendingForm] = useState<boolean>(false)
    const { toast } = useToast()
    const router = useRouter()
    const { data: session } = useSession()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            report_year: undefined,
            unique_number: "",
            report_date: "",
            name: "",
            lastName: "",
            gender: undefined,
            dateOfBirth: '',
            age: "",
            sex: undefined,
            province: undefined,
            municipality: undefined,
            street: "",
            community: '',
            phone: "",
            have_whatsapp: '2',
            identity_document: "",
            email: '',
            marital_status: undefined,
            workshop_participating_quality: undefined,
            have_disability: undefined,
            disability_type: undefined,
            another_disability_type: "",
            is_studying: undefined,
            last_education_level: undefined,
            is_working: undefined,
            available_days: undefined,
            available_schedule_for_participate_training: undefined,
            topics_to_be_trained: "",
            permission_for_taking_photos_videos: undefined

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

        const newData = {
            ...data,
            user_id: session?.user.id,
            sai_id: session?.user.id_sai,
            from_username: session?.user.username,
            id: null
        }

        const { error, data: resData, message } = await addParticipantInscriptionForm(Array(newData))

        if (error) {
            toast({
                variant: "destructive",
                title: "Formulario inscripción de participantes -> Agregar || " + appName,
                description: message,
                duration: 5000
            })
            setSendingForm(false)

        } else {
            form.reset();
            toast({
                title: "Formulario inscripción de participantes -> Agregar || " + appName,
                description: message,
                duration: 5000
            })
            router.push(`/participant_registration_form`)
        }
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
                            {currentStep === 1 && <ReportDetails form={form} />}
                            {currentStep === 2 && <PersonalDetails form={form} />}
                            {currentStep === 3 && <QuestionsDetails form={form} />}

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