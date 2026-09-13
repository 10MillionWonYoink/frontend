import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface FullScreenLoadingProps {
  isOpen: boolean;
  message?: string;
}

export function FullScreenLoading({
  isOpen,
  message = "처리 중입니다...",
}: FullScreenLoadingProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-label={message}
      className="m-auto border-0 bg-transparent p-0 shadow-none backdrop:bg-white/25 backdrop:backdrop-blur-sm"
      onCancel={(event) => event.preventDefault()}
    >
      <div className="flex min-w-48 flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-xl">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#d9d0fa] border-t-[#7657e8]" />

        <p className="text-sm font-bold text-[#342953]">{message}</p>
      </div>
    </dialog>,
    document.body,
  );
}
