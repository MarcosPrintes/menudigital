import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Login",
  description: "Sign in to continue",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <LoginForm />
    </main>
  );
}
