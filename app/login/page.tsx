import { FormButton, FormLinkButton } from "@/src/components/form/FormButton";
import { FormInput } from "@/src/components/form/FormInput";

export const metadata = {
  title: "Login",
  description: "Sign in to continue",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <form className="w-full rounded-lg border border-zinc-200 p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">Login</h1>

        <FormInput
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />

        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          containerClassName=""
        />

        <div className="mt-6 flex gap-3">
          <FormButton type="submit">Login</FormButton>
          <FormLinkButton href="/">Go back</FormLinkButton>
        </div>
      </form>
    </main>
  );
}
