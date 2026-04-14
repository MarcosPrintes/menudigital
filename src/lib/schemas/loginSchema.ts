import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Invalid email")
    .refine((email) => {
      const domain = email.split("@")[1];
      return Boolean(domain && domain.includes("."));
    }, "Email must contain a valid domain"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
