import React from "react";

interface FormSelectProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

const inputStyles =
  "w-full bg-white/95 border-2 border-gray-200 focus:border-custume-blue text-gray-800 text-base hind rounded-lg px-4 py-3.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custume-blue/20 transition-all duration-300 hover:border-gray-300";
const labelStyles =
  "monserrat block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide";
const errorStyles =
  "text-custume-red text-xs mt-1.5 hind font-medium flex items-center gap-1";

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
  required = false,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className={labelStyles}>
        {label} {required && <span className="text-custume-red">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${inputStyles} ${
          error
            ? "border-custume-red focus:border-custume-red focus:ring-custume-red/20"
            : ""
        }`}
      >
        <option value="">Seleccione una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className={errorStyles}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
