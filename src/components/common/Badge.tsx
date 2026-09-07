import type { ReactNode } from "react";

type BadgeTone = "purple" | "mint" | "pink" | "yellow";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

const toneClassNames: Record<BadgeTone, string> = {
  purple: "bg-[#ebe5ff] text-[#6c4cff]",
  mint: "bg-[#d8f7ef] text-[#008d78]",
  pink: "bg-[#ffe1eb] text-[#d93f75]",
  yellow: "bg-[#fff0bd] text-[#9a6b00]",
};

export function Badge({ children, tone = "purple" }: BadgeProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-extrabold ${toneClassNames[tone]}`}
    >
      {children}
    </span>
  );
}
