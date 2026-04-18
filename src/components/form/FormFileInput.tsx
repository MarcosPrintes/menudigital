import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type FormFileInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  id: string;
  containerClassName?: string;
  error?: string;
};

export const FormFileInput = forwardRef<HTMLInputElement, FormFileInputProps>(
  function FormFileInput(
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
          type="file"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium ${
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
  },
);
