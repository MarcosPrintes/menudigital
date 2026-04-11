import { z } from "zod";

const brazilianPhoneRegex = /^(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})-?\d{4}$/;

export const registerSchema = z
  .object({
    name: z.string().min(3, "Name must contain at least 3 characters"),
    phone: z.string().regex(brazilianPhoneRegex, "Invalid Brazilian phone number"),
    email: z
      .email("Invalid email")
      .refine((email) => {
        const domain = email.split("@")[1];
        return Boolean(domain && domain.includes("."));
      }, "Email must contain a valid domain"),
    password: z.string().min(7, "Password must be greater than 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
