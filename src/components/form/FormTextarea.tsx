import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  id: string;
  containerClassName?: string;
  error?: string;
};

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea(
    { label, id, containerClassName = "mb-4", className = "", error, ...textareaProps },
    ref,
  ) {
    return (
      <div className={containerClassName}>
        <label className="mb-2 block text-sm font-medium" htmlFor={id}>
          {label}
        </label>
        <textarea
          id={id}
          ref={ref}
          rows={4}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-md border px-3 py-2 outline-none ${
            error ? "border-red-500 focus:border-red-500" : "border-zinc-300 focus:border-zinc-500"
          } ${className}`.trim()}
          {...textareaProps}
        />
        {error ? (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
