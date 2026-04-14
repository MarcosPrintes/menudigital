import { FormButton, FormLinkButton } from "@/src/components/form/FormButton";

type AuthFormActionsProps = {
  submitLabel: string;
  isSubmitting: boolean;
  backHref?: string;
  backLabel?: string;
};

export function AuthFormActions({
  submitLabel,
  isSubmitting,
  backHref = "/",
  backLabel = "Go back",
}: AuthFormActionsProps) {
  return (
    <div className="mt-6 flex gap-3">
      <FormButton type="submit" disabled={isSubmitting}>
        {submitLabel}
      </FormButton>
      <FormLinkButton href={backHref}>{backLabel}</FormLinkButton>
    </div>
  );
}
