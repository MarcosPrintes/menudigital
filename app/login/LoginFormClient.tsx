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

type SubmitFeedback = {
  variant: "error" | "success";
  message: string;
} | null;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
};

export function LoginFormClient() {
  const [submitFeedback, setSubmitFeedback] = useState<SubmitFeedback>(null);
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
    setSubmitFeedback(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result) {
        setSubmitFeedback({
          variant: "error",
          message: "Unable to complete login right now. Please try again.",
        });
        return;
      }

      if (result.error) {
        setSubmitFeedback({
          variant: "error",
          message: AUTH_ERROR_MESSAGES[result.error] ?? "Invalid email or password.",
        });
        return;
      }

      setSubmitFeedback({
        variant: "success",
        message: "Welcome back! Redirecting...",
      });
      router.replace("/menu");
      router.refresh();
    } catch {
      setSubmitFeedback({
        variant: "error",
        message: "Something went wrong while logging in. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AuthFormCard title="Login">
        {submitFeedback ? (
          <FormFeedbackMessage message={submitFeedback.message} variant={submitFeedback.variant} />
        ) : null}

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
