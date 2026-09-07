import type { ReactNode } from "react";

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className = "" }: MobileShellProps) {
  return (
    <main className="min-h-dvh bg-[#f1eef9] sm:px-4 sm:py-6">
      <div
        className={`mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-x-hidden bg-[#fbfaff] sm:min-h-[calc(100dvh-3rem)] sm:rounded-[2rem] sm:shadow-[0_20px_70px_rgba(61,51,92,0.16)] ${className}`}
      >
        {children}
      </div>
    </main>
  );
}
