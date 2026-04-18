import "server-only";

import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { getApiUrl } from "@/src/services/config/apiConfig";
import { ServiceResult } from "@/src/types/serviceResult";

export type RefreshSessionSuccess = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshSessionError = {
  message: string;
  status?: number;
};

type RefreshApiBody = {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

const refreshLocks = new Map<string, Promise<ServiceResult<RefreshSessionSuccess, RefreshSessionError>>>();

export async function refreshSessionTokens(
  refreshToken: string
): Promise<ServiceResult<RefreshSessionSuccess, RefreshSessionError>> {
  const lockKey = refreshToken;
  const existing = refreshLocks.get(lockKey);
  if (existing) {
    return existing;
  }

  const promise = fetchRefresh(refreshToken).finally(() => {
    refreshLocks.delete(lockKey);
  });

  refreshLocks.set(lockKey, promise);
  return promise;
}

async function fetchRefresh(
  refreshToken: string
): Promise<ServiceResult<RefreshSessionSuccess, RefreshSessionError>> {
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
    response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.AUTH_REFRESH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
  } catch {
    return {
      success: false,
      error: {
        message: "Could not reach refresh service.",
      },
    };
  }

  const parsed = (await response.json().catch(() => null)) as RefreshApiBody | null;

  if (!response.ok) {
    return {
      success: false,
      error: {
        message: "Session refresh failed.",
        status: response.status,
      },
    };
  }

  const accessToken = parsed?.data?.accessToken;
  const newRefreshToken = parsed?.data?.refreshToken;

  if (typeof accessToken !== "string" || typeof newRefreshToken !== "string") {
    return {
      success: false,
      error: {
        message: "Refresh API response has an unexpected format.",
      },
    };
  }

  return {
    success: true,
    data: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  };
}
