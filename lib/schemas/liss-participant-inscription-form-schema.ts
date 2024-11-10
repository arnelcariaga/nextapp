import * as z from "zod";

export const formSchema = z
  .object({
    report_year: z.enum(["1", "2", "3", "4"]).optional(),
    unique_number: z
      .string()
      .min(4, "El No. único debe contener al menos 4 carácteres"),
    report_date: z
      .string({
        required_error: "La fecha es obligatoria",
      })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Por favor introduzca una fecha válida"),
    name: z
      .string({
        required_error: "Campo requerido",
      })
      .min(2, "El nombre debe contener al menos 2 carácteres"),
    lastName: z
      .string({
        required_error: "Campo requerido",
      })
      .min(2, "Apellido(s) debe contener al menos 2 carácteres"),
    dateOfBirth: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
        message: "Por favor introduzca una fecha válida",
      }),
    age: z
      .string({
        required_error: "La edad es requerida",
      })
      .min(1, "Obligatoria"),
    sex: z.enum(["1", "2", "3"], {
      required_error: "El sexo es obligatorio",
    }),
    gender: z.enum(["1", "2", "3"], {
      required_error: "El sexo es obligatorio",
    }),
    province: z.string({
      required_error: "La provincia es obligatoria",
    }),
    municipality: z
      .string({
        required_error: "El municipio es obligatorio",
      })
      .refine((data) => data !== "select", {
        message: "El municipio es obligatorio",
      }),
    street: z.string().min(5, "La calle debe contener al menos 5 carácteres"),
    community: z
      .string()
      .min(5, "La comunidad debe contener al menos 5 carácteres"),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Por favor introduzca un número válido"),
    have_whatsapp: z.enum(["1", "2"], {
      required_error: "Debe especificar",
    }),
    identity_document: z.string().optional(),
    email: z.string().email("Por favor introduzca un correo válido"),
    marital_status: z.enum(["1", "2", "3"], {
      required_error: "El estado civil es obligatorio",
    }),
    workshop_participating_quality: z.enum(["1", "2"]).optional(),
    have_disability: z.enum(["1", "2"], {
      required_error: "Debe especificar si tiene alguna discapacidad",
    }),
    disability_type: z.enum(["1", "2", "3", "4", "5"]).optional(),
    another_disability_type: z.string().optional(),
    is_studying: z.enum(["1", "2"]).optional(),
    last_education_level: z.enum(["1", "2", "3", "4"]).optional(),
    is_working: z.enum(["1", "2"], {
      required_error: "Debe especificar si estas laborando",
    }),
    available_days: z
      .array(z.string(), {
        message: "Seleccione al menos una opción",
      })
      .min(1, "Por favor seleccione"),
    available_schedule_for_participate_training: z
      .array(z.string(), {
        message: "Seleccione al menos una opción",
      })
      .min(1, "Por favor seleccione"),
    topics_to_be_trained: z.string().optional(),
    permission_for_taking_photos_videos: z.enum(["1", "2"], {
      required_error: "Debe especificar",
    }),
  })
  .refine(
    (data) => {
      if (data.have_disability === "1") {
        return !!data.disability_type;
      }
      return true;
    },
    {
      message: "Especifique el tipo de discapacidad",
      path: ["disability_type"],
    }
  )
  .refine(
    (data) => {
      if (data.disability_type === "4") {
        return !!data.another_disability_type;
      }
      return true;
    },
    {
      message: "Obligatorio",
      path: ["another_disability_type"],
    }
  );

export type FormValues = z.infer<typeof formSchema>;
