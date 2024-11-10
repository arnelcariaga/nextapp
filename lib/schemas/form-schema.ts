import * as z from "zod";

export const formSchema = z.object({
  expedient: z.string(),
  record: z.string(),
  fapps_id: z.string().min(4, "ID FAPPS debe contener al menos 4 carácteres"),
  clinic_entry: z.enum(["1", "2", "3", "4"], {
    required_error: "La entrada a clínica es obligatoria",
  }),
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
  gender: z.enum(["1", "2"], {
    required_error: "El sexo es obligatorio",
  }),
  weight: z
    .string({
      required_error: "El peso es requerido",
    })
    .min(2, "El peso debe contener al menos 2 carácteres"),
  dateOfBirth: z
    .string({
      required_error: "Fecha de nacimiento obligatoria",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Por favor introduzca una fecha válida"),
  age: z
    .string({
      required_error: "La edad es requerida",
    })
    .min(1, "La edad es obligatoria"),
  age_range: z.string({
    required_error: "Rango de edad obligatoria",
  }),
  nationality: z.enum(["mr", "mrs", "miss", "dr", "prof"], {
    required_error: "La nacionalidad es obligatoria",
  }),
  identity_document: z
    .string()
    .min(1, "Documento de indentidad es obligatorio"),
  target_population: z.enum(["1", "2"], {
    required_error: "Población Objetivo es obligatorio",
  }),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Por favor introduzca un número válido"),
  phone2: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: "Por favor introduzca un número válido",
    }),
  characterization: z
    .array(z.string())
    .min(1, "Por favor seleccione al menos una caraterización"),
  address: z
    .string()
    .min(5, "La dirección debe contener al menos 5 carácteres"),
  province: z.enum(["1", "2"], {
    required_error: "La provincia es obligatoria",
  }),
  municipality: z.enum(["1", "2"], {
    required_error: "El municipio es obligatorio",
  }),
  sector: z
    .string({
      required_error: "Campo obligatorio",
    })
    .min(3, "El sector debe contener al menos 3 carácteres"),
  diagnosticDate: z
    .string({
      required_error: "Fecha de diagnóstico obligatoria",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Por favor introduzca una fecha válida"),
  entryDate: z
    .string({
      required_error: "Fecha de ingreso obligatoria",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Por favor introduzca una fecha válida"),
  vcBasal: z.string().optional(),
  vcBasalDate: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Por favor introduzca una fecha válida",
    }),
  cd4Basal: z.string().optional(),
  cd4BasalDate: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Por favor introduzca una fecha válida",
    }),
  arvStartDate: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: "Por favor introduzca una fecha válida",
    }),
  indexReferer: z.enum(["1", "2"]).optional(),
  belongsToOBC: z.enum(["1", "2"]).optional(),
});

export type FormValues = z.infer<typeof formSchema>;
