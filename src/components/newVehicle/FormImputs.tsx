import React from "react";

interface InputFieldProps {
  label: string;
  type?: "text" | "number" | "email" | "password" | "tel" | "url";
  name: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  placeholder,
  required = false,
  error,
  min,
  max,
  step,
  maxLength,
  icon,
  prefix,
  suffix,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="monserrat block text-sm font-semibold text-custume-gray uppercase tracking-wide"
      >
        {label} {required && <span className="text-custume-red">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-custume-gray">
            {icon}
          </div>
        )}

        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-custume-gray font-semibold text-lg">
            {prefix}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
          className={`w-full bg-white/95 border-2 border-custume-gray focus:border-custume-blue text-custume-blue text-base hind rounded-lg px-4 py-3.5 placeholder-custume-gray focus:outline-none focus:ring-2 focus:ring-custume-blue/20 transition-all duration-300 hover:border-custume-gray ${
            error
              ? "border-custume-gray focus:border-custume-blue focus:ring-custume-blue/20"
              : ""
          } ${
            disabled ? "opacity-50 cursor-not-allowed bg-custume-gray" : ""
          } ${icon ? "pl-10" : ""} ${prefix ? "pl-10" : ""} ${
            suffix ? "pr-16" : ""
          }`}
        />

        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-custume-gray text-sm">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p className="text-custume-blue text-xs mt-1.5 hind font-medium flex items-center gap-1">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
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
};

export default InputField;
