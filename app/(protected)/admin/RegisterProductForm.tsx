"use client";

import { registerProductWithImageAction } from "@/src/actions/registerProductActions";
import { AuthFormActions } from "@/src/components/auth/AuthFormActions";
import { AuthFormCard } from "@/src/components/auth/AuthFormCard";
import { FormFeedbackMessage } from "@/src/components/auth/FormFeedbackMessage";
import { FormFileInput } from "@/src/components/form/FormFileInput";
import { FormInput } from "@/src/components/form/FormInput";
import { FormTextarea } from "@/src/components/form/FormTextarea";
import {
  registerProductFormSchema,
  type RegisterProductFormValues,
} from "@/src/lib/schemas/registerProductFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function RegisterProductForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterProductFormValues>({
    resolver: zodResolver(registerProductFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      price: "",
      image: undefined,
    },
  });

  const onSubmit = async (data: RegisterProductFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!(data.image instanceof FileList) || data.image.length === 0) {
      setSubmitError("Image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("title", data.title.trim());
    formData.append("description", data.description.trim());
    formData.append("price", data.price);

    const result = await registerProductWithImageAction(formData);

    if (!result.success) {
      setSubmitError(result.message ?? "Could not register product.");
      return;
    }

    setSubmitSuccess(result.message);
    reset({
      title: "",
      description: "",
      price: "",
      image: undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <AuthFormCard title="Register product">
        {submitError ? <FormFeedbackMessage message={submitError} variant="error" /> : null}

        {submitSuccess ? <FormFeedbackMessage message={submitSuccess} variant="success" /> : null}

        <FormFileInput
          id="product-image"
          label="Image"
          accept="image/*"
          error={errors.image?.message}
          {...register("image")}
        />

        <FormInput
          id="product-title"
          label="Title"
          type="text"
          autoComplete="off"
          error={errors.title?.message}
          {...register("title")}
        />

        <FormTextarea
          id="product-description"
          label="Description"
          autoComplete="off"
          error={errors.description?.message}
          {...register("description")}
        />

        <FormInput
          id="product-price"
          label="Price"
          type="text"
          inputMode="decimal"
          placeholder="R$ 0,00"
          autoComplete="off"
          error={errors.price?.message}
          {...register("price")}
        />

        <AuthFormActions submitLabel="Register product" isSubmitting={isSubmitting} backHref="/menu" />
      </AuthFormCard>
    </form>
  );
}
