import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  containerClassName?: string;
  error?: string;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
  { label, id, containerClassName = "mb-4", className = "", error, ...inputProps },
  ref,
) {
  return (
    <div className={containerClassName}>
      <label className="mb-2 block text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-md border px-3 py-2 outline-none ${
          error ? "border-red-500 focus:border-red-500" : "border-zinc-300 focus:border-zinc-500"
        } ${className}`.trim()}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});
