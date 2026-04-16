"use server";

import { auth, signOut } from "@/auth";
import { logoutClient } from "@/src/services/logoutService";

export type LogoutActionState = {
  error: string | null;
};

export const initialLogoutActionState: LogoutActionState = {
  error: null,
};

export async function logoutAction(): Promise<LogoutActionState> {
  const session = await auth();
  const result = await logoutClient(session?.accessToken);

  if (!result.success) {
    const statusInfo = result.error.status ? ` (status ${result.error.status})` : "";
    console.error(`Logout failed${statusInfo}: ${result.error.message}`);
    return {
      error: result.error.message,
    };
  }

  await signOut({ redirectTo: "/" });
  return {
    error: null,
  };
}
