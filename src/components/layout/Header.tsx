"use client";

import {
  initialLogoutActionState,
  logoutAction,
  type LogoutActionState,
} from "@/src/actions/authActions";
import { useActionState } from "react";

export function Header() {
  const [state, formAction, isPending] = useActionState<LogoutActionState, FormData>(
    logoutAction,
    initialLogoutActionState
  );

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-end px-6 py-4">
        <form action={formAction}>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100"
          >
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </form>
        {state.error ? (
          <p className="mt-2 text-sm text-red-600">{state.error}</p>
        ) : null}
      </div>
    </header>
  );
}
