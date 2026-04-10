import { FormButton, FormLinkButton } from "@/src/components/form/FormButton";
import { FormInput } from "@/src/components/form/FormInput";

export const metadata = {
  title: "Register",
  description: "Create your account",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-8">
      <form className="w-full rounded-lg border border-zinc-200 p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">Register</h1>

        <FormInput id="name" name="name" label="Name" type="text" autoComplete="name" />

        <FormInput id="phone" name="phone" label="Telefone" type="tel" autoComplete="tel" />

        <FormInput id="email" name="email" label="Email" type="email" autoComplete="email" />

        <FormInput
          id="password"
          name="password"
          label="Senha"
          type="password"
          autoComplete="new-password"
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          containerClassName=""
        />

        <div className="mt-6 flex gap-3">
          <FormButton type="submit">Register</FormButton>
          <FormLinkButton href="/">Go back</FormLinkButton>
        </div>
      </form>
    </main>
  );
}
