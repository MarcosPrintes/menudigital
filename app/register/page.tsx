import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Register",
  description: "Create your account",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-8">
      <RegisterForm />
    </main>
  );
}
