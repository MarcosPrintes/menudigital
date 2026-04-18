"use server";

import { auth } from "@/auth";
import { MAX_PRODUCT_IMAGE_BYTES } from "@/src/constants/productImageLimits";
import { registerProductPayloadSchema } from "@/src/lib/schemas/registerProductPayloadSchema";
import { registerProduct } from "@/src/services/registerProductService";
import { uploadImage } from "@/src/services/uploadImageService";
import { parseCurrencyToNumber } from "@/src/utils/currency";

export type RegisterProductActionResult = {
  success: boolean;
  message: string | null;
};

export async function registerProductWithImageAction(
  formData: FormData,
): Promise<RegisterProductActionResult> {
  const session = await auth();
  if (!session?.accessToken) {
    return {
      success: false,
      message: "You must be signed in to register products.",
    };
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return {
      success: false,
      message: "A valid image file is required.",
    };
  }
  if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
    return {
      success: false,
      message: "Image must be 2MB or smaller.",
    };
  }
  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      message: "File must be an image.",
    };
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const priceRaw = formData.get("price");
  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof priceRaw !== "string"
  ) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  const amount = parseCurrencyToNumber(priceRaw.trim());
  if (amount === null || amount <= 0) {
    return {
      success: false,
      message: "Enter a valid currency value.",
    };
  }

  const textFieldsOnly = registerProductPayloadSchema.omit({ image: true }).safeParse({
    title: title.trim(),
    description: description.trim(),
    price: amount,
  });
  if (!textFieldsOnly.success) {
    return {
      success: false,
      message: textFieldsOnly.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const uploadResult = await uploadImage(session.accessToken, file);
  if (!uploadResult.success) {
    return {
      success: false,
      message: uploadResult.error.message,
    };
  }

  const parsed = registerProductPayloadSchema.safeParse({
    image: uploadResult.data.url,
    ...textFieldsOnly.data,
  });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const result = await registerProduct(session.accessToken, parsed.data);
  if (!result.success) {
    return {
      success: false,
      message: result.error.message,
    };
  }

  return {
    success: true,
    message: `Product “${result.data.title}” registered successfully.`,
  };
}

export async function registerProductAction(
  payload: unknown,
): Promise<RegisterProductActionResult> {
  const session = await auth();
  if (!session?.accessToken) {
    return {
      success: false,
      message: "You must be signed in to register products.",
    };
  }

  const parsed = registerProductPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  const result = await registerProduct(session.accessToken, parsed.data);
  if (!result.success) {
    return {
      success: false,
      message: result.error.message,
    };
  }

  return {
    success: true,
    message: `Product “${result.data.title}” registered successfully.`,
  };
}
