"use client";

import { useEffect } from "react";

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Menu page failed to render", error);
  }, [error.message]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-10 text-center">
      <h1 className="text-3xl font-bold">Menu error</h1>
      <p className="mt-3 text-zinc-600">
        We could not load the menu right now. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        Try again
      </button>
    </main>
  );
}
