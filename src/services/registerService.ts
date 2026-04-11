import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { ServiceResult } from "@/src/types/serviceResult";

export type RegisterPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisteredClient = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

type RegisterSuccessApiResponse = {
  data?: {
    client?: RegisteredClient;
  };
};

type RegisterErrorApiResponse = {
  message?: string;
  code?: string;
};

export type RegisterServiceError = {
  message: string;
  status?: number;
  code?: string;
};

function isRegisteredClient(value: unknown): value is RegisteredClient {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    typeof candidate.phone === "string" &&
    typeof candidate.email === "string"
  );
}

export async function registerClient(
  payload: RegisterPayload
): Promise<ServiceResult<RegisteredClient, RegisterServiceError>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.REGISTER}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  console.log("response =====>", response);
  if (!response.ok) {
    let message = "Could not register client.";
    let code: string | undefined;

    try {
      const errorResponse = (await response.json()) as RegisterErrorApiResponse;
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

  const jsonParsed = (await response.json()) as RegisterSuccessApiResponse;

  if (!isRegisteredClient(jsonParsed.data?.client)) {
    return {
      success: false,
      error: {
        message: "Register API response has an unexpected format.",
      },
    };
  }

  return {
    success: true,
    data: jsonParsed.data.client,
  };
}
