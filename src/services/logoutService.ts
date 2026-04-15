import "server-only";
import { COOKIE_NAMES } from "@/src/constants/cookies";
import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { getApiUrl } from "@/src/services/config/apiConfig";
import { ServiceResult } from "@/src/types/serviceResult";
import { cookies } from "next/headers";

type LogoutError = {
  message: string;
  status?: number;
};

export async function logoutClient(): Promise<ServiceResult<null, LogoutError>> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

  if (!accessToken) {
    cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
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
    cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
    return {
      success: false,
      error: {
        message: "Could not reach logout service. Please try again.",
      },
    };
  }

  cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);

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
