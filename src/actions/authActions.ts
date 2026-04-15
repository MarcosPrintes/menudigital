"use server";

import { logoutClient } from "@/src/services/logoutService";
import { redirect } from "next/navigation";

export type LogoutActionState = {
  error: string | null;
};

export const initialLogoutActionState: LogoutActionState = {
  error: null,
};

export async function logoutAction(): Promise<LogoutActionState> {
  const result = await logoutClient();

  if (!result.success) {
    const statusInfo = result.error.status ? ` (status ${result.error.status})` : "";
    console.error(`Logout failed${statusInfo}: ${result.error.message}`);
    return {
      error: result.error.message,
    };
  }

  redirect("/");
}
