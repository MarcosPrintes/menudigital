type FormFeedbackMessageProps = {
  message: string;
  variant: "error" | "success";
};

const variantClassName: Record<FormFeedbackMessageProps["variant"], string> = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-green-200 bg-green-50 text-green-700",
};

export function FormFeedbackMessage({ message, variant }: FormFeedbackMessageProps) {
  return (
    <p
      className={`mb-4 rounded-md border px-3 py-2 text-sm ${variantClassName[variant]}`}
      role={variant === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  );
}
