import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

type FormLinkButtonProps = {
  href: string;
  children: ReactNode;
};

export function FormButton({ children, className = "", ...props }: FormButtonProps) {
  return (
    <button
      className={`w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export function FormLinkButton({ href, children }: FormLinkButtonProps) {
  return (
    <Link
      href={href}
      className="w-full rounded-md border border-zinc-300 px-4 py-2 text-center text-sm font-medium hover:bg-zinc-100"
    >
      {children}
    </Link>
  );
}
