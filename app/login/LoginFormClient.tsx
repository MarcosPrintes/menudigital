"use client";

import { AuthFormActions } from "@/src/components/auth/AuthFormActions";
import { AuthFormCard } from "@/src/components/auth/AuthFormCard";
import { FormFeedbackMessage } from "@/src/components/auth/FormFeedbackMessage";
import { FormInput } from "@/src/components/form/FormInput";
import { loginSchema, type LoginFormValues } from "@/src/lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function LoginFormClient() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setSubmitError("Invalid email or password.");
      return;
    }

    setSubmitSuccess("Welcome back! Redirecting...");
    router.push("/menu");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AuthFormCard title="Login">
        {submitError ? <FormFeedbackMessage message={submitError} variant="error" /> : null}

        {submitSuccess ? <FormFeedbackMessage message={submitSuccess} variant="success" /> : null}

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
          label="Password"
          type="password"
          autoComplete="current-password"
          containerClassName=""
          error={errors.password?.message}
          {...register("password")}
        />

        <AuthFormActions submitLabel="Login" isSubmitting={isSubmitting} />
      </AuthFormCard>
    </form>
  );
}
