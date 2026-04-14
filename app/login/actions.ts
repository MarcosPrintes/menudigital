"use server";

import {
  type LoggedClient,
  loginClient,
  type LoginPayload,
  type LoginServiceError,
} from "@/src/services/loginService";
import { ServiceResult } from "@/src/types/serviceResult";

type LoginActionSuccess = {
  client: LoggedClient;
};

export async function loginAction(
  payload: LoginPayload
): Promise<ServiceResult<LoginActionSuccess, LoginServiceError>> {
  const result = await loginClient(payload);
  if (!result.success) {
    return result;
  }

  return {
    success: true,
    data: {
      client: result.data.client,
    },
  };
}
