import { MAX_PRODUCT_IMAGE_BYTES } from "@/src/constants/productImageLimits";
import { parseCurrencyToNumber } from "@/src/utils/currency";
import { z } from "zod";

export const registerProductFormSchema = z
  .object({
    image: z.custom<FileList | undefined>((val) => val === undefined || val instanceof FileList),
    title: z.string().trim().min(3, "Title must contain at least 3 characters"),
    description: z.string().trim().min(10, "Description must contain at least 10 characters"),
    price: z.string().trim().min(1, "Price is required"),
  })
  .superRefine((data, ctx) => {
    if (!(data.image instanceof FileList) || data.image.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Image is required",
        path: ["image"],
      });
    } else {
      const file = data.image[0];
      if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
        ctx.addIssue({
          code: "custom",
          message: "Image must be 2MB or smaller",
          path: ["image"],
        });
      }
      if (!file.type.startsWith("image/")) {
        ctx.addIssue({
          code: "custom",
          message: "File must be an image",
          path: ["image"],
        });
      }
    }

    const amount = parseCurrencyToNumber(data.price);
    if (amount === null) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid currency value (e.g. R$ 10,00)",
        path: ["price"],
      });
    } else if (amount <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Price must be greater than zero",
        path: ["price"],
      });
    }
  });

export type RegisterProductFormValues = z.infer<typeof registerProductFormSchema>;
