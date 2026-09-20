import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...cardProps }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-[#e9e4f7] bg-white p-5 shadow-[0_8px_30px_rgba(61,51,92,0.06)] ${className}`}
      {...cardProps}
    >
      {children}
    </div>
  );
}
