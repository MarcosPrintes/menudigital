"use server";

import { auth } from "@/auth";
import { deleteProduct } from "@/src/services/deleteProductService";
import { revalidatePath } from "next/cache";

type DeleteProductActionErrorCause = {
  status?: number;
  code?: string;
  reason: string;
};

function createDeleteProductActionError(
  message: string,
  cause: DeleteProductActionErrorCause,
): Error {
  const error = new Error(message, { cause });
  error.name = "DeleteProductActionError";
  return error;
}

export async function deleteProductAction(productId: string): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) {
    throw createDeleteProductActionError("You must be signed in to delete products.", {
      status: 401,
      code: "UNAUTHORIZED",
      reason: "missing_access_token",
    });
  }

  const result = await deleteProduct(session.accessToken, productId);
  if (!result.success) {
    const actionError = createDeleteProductActionError(result.error.message, {
      status: result.error.status,
      code: result.error.code,
      reason: "delete_product_service_failed",
    });

    const statusInfo = result.error.status ? ` status=${result.error.status}` : "";
    const codeInfo = result.error.code ? ` code=${result.error.code}` : "";
    console.error(`Delete product failed:${statusInfo}${codeInfo} message="${result.error.message}"`);
    throw actionError;
  }

  revalidatePath("/menu");
}
