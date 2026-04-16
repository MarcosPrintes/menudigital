import "server-only";
import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { getApiUrl } from "@/src/services/config/apiConfig";
import { ServiceResult } from "@/src/types/serviceResult";

type LogoutError = {
  message: string;
  status?: number;
};

export async function logoutClient(accessToken?: string): Promise<ServiceResult<null, LogoutError>> {
  if (!accessToken) {
    return {
      success: true,
      data: null,
    };
  }

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
    response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.LOGOUT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      error: {
        message: "Could not reach logout service. Please try again.",
      },
    };
  }

  if (!response.ok) {
    return {
      success: false,
      error: {
        message: "Could not logout.",
        status: response.status,
      },
    };
  }

  return {
    success: true,
    data: null,
  };
}
