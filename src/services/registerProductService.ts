import "server-only";

import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { type RegisterProductPayload } from "@/src/lib/schemas/registerProductPayloadSchema";
import { getApiUrl } from "@/src/services/config/apiConfig";
import { ServiceResult } from "@/src/types/serviceResult";

export type RegisteredProductDto = {
  id: number;
  image: string;
  title: string;
  description: string;
  price: string;
};

type RegisterProductSuccessApiResponse = {
  data?: {
    product?: RegisteredProductDto;
  };
  message?: string;
};

type RegisterProductErrorApiResponse = {
  message?: string;
  code?: string;
};

export type RegisterProductServiceError = {
  message: string;
  status?: number;
  code?: string;
};

function isRegisteredProduct(value: unknown): value is RegisteredProductDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.image === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.price === "string"
  );
}

export async function registerProduct(
  accessToken: string,
  payload: RegisterProductPayload,
): Promise<ServiceResult<RegisteredProductDto, RegisterProductServiceError>> {
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
    response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.REGISTER_PRODUCT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
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
    let message = "Could not register product.";
    let code: string | undefined;

    try {
      const errorResponse = (await response.json()) as RegisterProductErrorApiResponse;
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

  const jsonParsed = (await response.json()) as RegisterProductSuccessApiResponse;

  if (!isRegisteredProduct(jsonParsed.data?.product)) {
    return {
      success: false,
      error: {
        message: "Register product API response has an unexpected format.",
      },
    };
  }

  return {
    success: true,
    data: jsonParsed.data.product,
  };
}
