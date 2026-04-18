import { z } from "zod";

/** Matches the API `registerProductSchema` (JSON body after client-side image handling). */
export const registerProductPayloadSchema = z.object({
  image: z.string().trim().url("Image must be a valid URL"),
  title: z.string().trim().min(3, "Title must contain at least 3 characters"),
  description: z.string().trim().min(10, "Description must contain at least 10 characters"),
  price: z.number().positive("Price must be greater than zero"),
});

export type RegisterProductPayload = z.infer<typeof registerProductPayloadSchema>;
