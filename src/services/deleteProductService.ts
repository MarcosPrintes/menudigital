import "server-only";

import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { getApiUrl } from "@/src/services/config/apiConfig";
import { ServiceResult } from "@/src/types/serviceResult";

type DeleteProductErrorApiResponse = {
  message?: string;
  code?: string;
};

export type DeleteProductServiceError = {
  message: string;
  status?: number;
  code?: string;
};

export async function deleteProduct(
  accessToken: string,
  productId: string,
): Promise<ServiceResult<null, DeleteProductServiceError>> {
  let apiBaseUrl: string;
  try {
    apiBaseUrl = getApiUrl();
  } catch {
    return {
      success: false,
      error: {
        message: "API base URL is not configured.",
      },
    };
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.DELETE_PRODUCT(productId)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      error: {
        message: "Could not reach the server. Please try again.",
      },
    };
  }

  if (!response.ok) {
    let message = "Could not delete product.";
    let code: string | undefined;

    try {
      const errorResponse = (await response.json()) as DeleteProductErrorApiResponse;
      if (typeof errorResponse.message === "string") {
        message = errorResponse.message;
      }
      if (typeof errorResponse.code === "string") {
        code = errorResponse.code;
      }
    } catch {
      // Keep default message when API does not return a valid JSON body.
    }

    return {
      success: false,
      error: {
        message,
        status: response.status,
        code,
      },
    };
  }

  return {
    success: true,
    data: null,
  };
}
