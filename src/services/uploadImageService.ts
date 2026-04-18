import "server-only";

import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { getApiUrl } from "@/src/services/config/apiConfig";
import { ServiceResult } from "@/src/types/serviceResult";

export type UploadedImageDto = {
  id: number;
  url: string;
};

type UploadImageSuccessApiResponse = {
  data?: {
    id?: number;
    url?: string;
  };
  message?: string;
};

type UploadImageErrorApiResponse = {
  message?: string;
  code?: string;
};

export type UploadImageServiceError = {
  message: string;
  status?: number;
  code?: string;
};

function isHttpOrHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isUploadedImageData(value: unknown): value is UploadedImageDto {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.id !== "number" || typeof candidate.url !== "string") {
    return false;
  }

  return candidate.url.length > 0 && isHttpOrHttpsUrl(candidate.url);
}

export async function uploadImage(
  accessToken: string,
  file: File,
): Promise<ServiceResult<UploadedImageDto, UploadImageServiceError>> {
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

  const formData = new FormData();
  formData.append("image", file, file.name);

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.UPLOAD_IMAGE}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
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
    let message = "Could not upload image.";
    let code: string | undefined;

    try {
      const errorResponse = (await response.json()) as UploadImageErrorApiResponse;
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

  const jsonParsed = (await response.json()) as UploadImageSuccessApiResponse;

  if (!isUploadedImageData(jsonParsed.data)) {
    return {
      success: false,
      error: {
        message: "Upload image API response has an unexpected format.",
      },
    };
  }

  return {
    success: true,
    data: jsonParsed.data,
  };
}
