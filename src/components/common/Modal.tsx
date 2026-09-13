import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isBusy?: boolean;
  children: ReactNode;
}

export function Modal({
  title,
  isOpen,
  onClose,
  isBusy = false,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!isOpen) {
      dialog.close();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);
  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-[398px] overflow-y-auto rounded-3xl border-0 bg-[#fbfaff] p-5 text-[#342953] shadow-2xl backdrop:bg-[#21173b]/50 backdrop:backdrop-blur-sm"
      onCancel={(event) => {
        event.preventDefault();
        if (!isBusy) onClose();
      }}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id={titleId} className="text-lg font-black">
          {title}
        </h2>
        <button
          type="button"
          disabled={isBusy}
          onClick={onClose}
          aria-label="닫기"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eee9ff] disabled:opacity-40"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>,
    document.body,
  );
}
