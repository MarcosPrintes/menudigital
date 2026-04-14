import type { ReactNode } from "react";

type AuthFormCardProps = {
  title: string;
  children: ReactNode;
};

export function AuthFormCard({ title, children }: AuthFormCardProps) {
  return (
    <div className="w-full rounded-lg border border-zinc-200 p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
      {children}
    </div>
  );
}
