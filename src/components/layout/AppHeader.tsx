import { Camera, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  actionLabel?: string;
  onAction?: () => void;
}

export function AppHeader({ actionLabel, onAction }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <Link
        to="/"
        className="flex items-center gap-2 text-sm font-black text-[#342953]"
      >
        <span className="grid size-8 place-items-center rounded-xl bg-[#6c4cff] text-white">
          <Camera className="size-4" aria-hidden="true" />
        </span>
        PICYOINK
      </Link>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex min-h-10 items-center gap-1 rounded-xl px-2 text-xs font-bold text-[#8b85a8]"
        >
          <LogOut className="size-4" aria-hidden="true" />
          {actionLabel}
        </button>
      )}
    </header>
  );
}
