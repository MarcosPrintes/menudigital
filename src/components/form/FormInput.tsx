import type { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  containerClassName?: string;
};

export function FormInput({
  label,
  id,
  containerClassName = "mb-4",
  className = "",
  ...inputProps
}: FormInputProps) {
  return (
    <div className={containerClassName}>
      <label className="mb-2 block text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500 ${className}`.trim()}
        {...inputProps}
      />
    </div>
  );
}
