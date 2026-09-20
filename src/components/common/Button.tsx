import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: ButtonVariant;
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "bg-[#6c4cff] text-white shadow-[0_10px_30px_rgba(108,76,255,0.24)] hover:bg-[#5d3ee8]",
  secondary: "bg-[#ff6b9d] text-white hover:bg-[#ee5a8d]",
  ghost: "border border-[#ded8f2] bg-white text-[#3d335c] hover:bg-[#f7f4ff]",
};

export function Button({
  children,
  className = "",
  fullWidth = false,
  type = "button",
  variant = "primary",
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClassNames[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
