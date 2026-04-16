"use server";

import { auth, signOut } from "@/auth";
import { logoutClient } from "@/src/services/logoutService";

type LogoutActionState = {
  error: string | null;
};

export async function logoutAction(
  _prevState: LogoutActionState,
  _formData: FormData
): Promise<LogoutActionState> {
  const session = await auth();
  const result = await logoutClient(session?.accessToken);

  if (!result.success) {
    const statusInfo = result.error.status ? ` (status ${result.error.status})` : "";
    console.error(`Logout failed${statusInfo}: ${result.error.message}`);
  }

  // Always clear local auth cookies/session, even if upstream logout fails.
  await signOut({ redirectTo: "/login" });
  return {
    error: null,
  };
}
