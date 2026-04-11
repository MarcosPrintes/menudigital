"use client";

import { FormButton, FormLinkButton } from "@/src/components/form/FormButton";
import { FormInput } from "@/src/components/form/FormInput";
import { registerSchema, type RegisterFormValues } from "@/src/lib/schemas/registerSchema";
import { registerClient } from "@/src/services/registerService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function RegisterForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const result = await registerClient(data);

    if (!result.success) {
      setSubmitError(result.error.message);
      return;
    }

    setSubmitSuccess(`Client ${result.data.name} registered successfully.`);
    reset();
  };

  return (
    <form
      className="w-full rounded-lg border border-zinc-200 p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="mb-6 text-2xl font-semibold">Register</h1>

      {submitError ? (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      {submitSuccess ? (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {submitSuccess}
        </p>
      ) : null}

      <FormInput
        id="name"
        label="Name"
        type="text"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />

      <FormInput
        id="phone"
        label="Telefone"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <FormInput
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormInput
        id="password"
        label="Senha"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <FormInput
        id="confirmPassword"
        label="Confirmar senha"
        type="password"
        autoComplete="new-password"
        containerClassName=""
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="mt-6 flex gap-3">
        <FormButton type="submit" disabled={isSubmitting}>
          Register
        </FormButton>
        <FormLinkButton href="/">Go back</FormLinkButton>
      </div>
    </form>
  );
}
