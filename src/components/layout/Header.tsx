"use client";

import { logoutAction } from "@/src/actions/authActions";
import { FormButton } from "@/src/components/form/FormButton";
import Link from "next/link";
import { useActionState } from "react";

type LogoutActionState = {
  error: string | null;
};

const initialLogoutActionState: LogoutActionState = {
  error: null,
};

type HeaderProps = {
  userName?: string;
  isLoggedIn?: boolean;
};

export function Header({ userName, isLoggedIn = false }: HeaderProps) {
  const [state, formAction, isPending] = useActionState<LogoutActionState, FormData>(
    logoutAction,
    initialLogoutActionState
  );

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-end px-6 py-4">
        <div className="flex items-center gap-4">
          {userName ? <p className="text-sm text-zinc-700">Ola, Sr. {userName}</p> : null}
          {isLoggedIn ? (
            <Link
              href="/admin"
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Admin
            </Link>
          ) : null}
          <form action={formAction}>
            <FormButton
              type="submit"
              disabled={isPending}
              className="w-auto transition"
            >
              {isPending ? "Logging out..." : "Logout"}
            </FormButton>
          </form>
        </div>
        {state.error ? (
          <p className="mt-2 text-sm text-red-600">{state.error}</p>
        ) : null}
      </div>
    </header>
  );
}
