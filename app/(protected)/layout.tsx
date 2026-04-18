import { ReactNode } from "react";
import { auth } from "@/auth";
import { Header } from "@/src/components/layout/Header";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user) && !session?.error;

  return (
    <>
      <Header userName={session?.user?.name ?? undefined} isLoggedIn={isLoggedIn} />
      {children}
    </>
  );
}
