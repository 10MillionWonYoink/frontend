import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface PreviewImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImagePreviewModalProps {
  image: PreviewImage | null;
  onClose: () => void;
}

export function ImagePreviewModal({
                                    image,
                                    onClose,
                                  }: ImagePreviewModalProps) {
  useEffect(() => {
    if (!image) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [image, onClose]);

  if (!image) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="제출 사진 크게 보기"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        // 이미지 바깥쪽 배경을 눌렀을 때만 닫기
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="이미지 닫기"
      >
        <X className="size-6" aria-hidden="true" />
      </button>

      <div className="flex max-h-full max-w-full flex-col items-center">
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[82vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
        />

        {image.caption && (
          <p
            className="mt-3 max-w-xl truncate rounded-full bg-black/40 px-4 py-2 text-center text-sm font-bold text-white">
            {image.caption}
          </p>
        )}
      </div>
    </div>,
    document.body,
  );
}