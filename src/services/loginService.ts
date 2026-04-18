import "server-only";
import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { ServiceResult } from "@/src/types/serviceResult";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoggedClient = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

type LoginSuccessApiResponse = {
  data?: {
    client?: LoggedClient;
    accessToken?: string;
    refreshToken?: string;
  };
};

type LoginErrorApiResponse = {
  message?: string;
  code?: string;
};

export type LoginServiceSuccess = {
  client: LoggedClient;
  accessToken: string;
  refreshToken: string;
};

export type LoginServiceError = {
  message: string;
  status?: number;
  code?: string;
};

function getApiBaseUrl(): string | null {
  const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (typeof baseUrl !== "string") {
    return null;
  }

  const normalizedBaseUrl = baseUrl.trim().replace(/\/+$/, "");
  return normalizedBaseUrl.length > 0 ? normalizedBaseUrl : null;
}

function isLoggedClient(value: unknown): value is LoggedClient {
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

async function parseResponseJson(
  response: Response
): Promise<LoginSuccessApiResponse | LoginErrorApiResponse | null> {
  try {
    return (await response.json()) as LoginSuccessApiResponse | LoginErrorApiResponse;
  } catch {
    return null;
  }
}

export async function loginClient(
  payload: LoginPayload
): Promise<ServiceResult<LoginServiceSuccess, LoginServiceError>> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return {
      success: false,
      error: {
        message: "API base URL is not configured.",
      },
    };
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      success: false,
      error: {
        message: "Could not reach login service. Please try again.",
      },
    };
  }

  const parsedResponse = await parseResponseJson(response);

  if (!response.ok) {
    let message = "Could not login.";
    let code: string | undefined;

    if (
      parsedResponse &&
      "message" in parsedResponse &&
      typeof parsedResponse.message === "string"
    ) {
      message = parsedResponse.message;
    }
    if (parsedResponse && "code" in parsedResponse && typeof parsedResponse.code === "string") {
      code = parsedResponse.code;
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

  const jsonParsed = parsedResponse as LoginSuccessApiResponse | null;
  const client = jsonParsed?.data?.client;
  const accessToken = jsonParsed?.data?.accessToken;
  const refreshToken = jsonParsed?.data?.refreshToken;

  if (
    !isLoggedClient(client) ||
    typeof accessToken !== "string" ||
    accessToken.length === 0 ||
    typeof refreshToken !== "string" ||
    refreshToken.length === 0
  ) {
    return {
      success: false,
      error: {
        message: "Login API response has an unexpected format.",
      },
    };
  }

  return {
    success: true,
    data: {
      client,
      accessToken,
      refreshToken,
    },
  };
}
