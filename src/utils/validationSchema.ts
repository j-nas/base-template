import { z } from 'zod'

export const phoneRegExp = /^((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}$/

export const contactFormValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Required" })
    .email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Required" })
    .max(10, { message: "Please enter a valid phone number" }),
  // .refine((v) => phoneRegExp.test(v), {
  //   message: "Please enter a valid phone number",
  // }),
  message: z
    .string()
    .min(1, { message: "Required" })
    .max(1000, { message: "Please limit to 1000 characters" }),
})