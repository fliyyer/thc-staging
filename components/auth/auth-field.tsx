"use client";

import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AuthFieldProps extends Omit<
  React.ComponentProps<"input">,
  "type"
> {
  id: string;
  label: string;
  placeholder: string;
  type?: "email" | "password" | "text";
  required?: boolean;
  error?: string;
}

export const AuthField = React.forwardRef<HTMLInputElement, AuthFieldProps>(
  (
    {
      id,
      label,
      placeholder,
      type = "text",
      required,
      className,
      error,
      ...props
    },
    ref,
  ) => {
    const isPassword = type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={cn("space-y-4", className)}>
        <Label
          className="block text-sm sm:text-lg font-semibold text-black"
          htmlFor={id}
        >
          {label}
          {required ? <span className="text-red-600 ml-1">*</span> : null}
        </Label>
        <div className="relative">
          <Input
            id={id}
            name={id}
            type={inputType}
            required={required}
            placeholder={placeholder}
            ref={ref}
            className={cn(
              "h-11 rounded-lg border-[#d6dbe1] bg-white px-5 text-sm sm:text-lg text-black shadow-none placeholder:text-[#8c8c8c] focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/10",
              error &&
                "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/10",
            )}
            aria-invalid={error ? "true" : "false"}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              aria-label={`${showPassword ? "Hide" : "Show"} ${label.toLowerCase()}`}
              className="absolute right-4 top-1/2 inline-flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center text-black"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          ) : null}
        </div>
        {error ? (
          <p className="text-xs text-red-500 font-medium mt-1">{error}</p>
        ) : null}
      </div>
    );
  },
);

AuthField.displayName = "AuthField";
