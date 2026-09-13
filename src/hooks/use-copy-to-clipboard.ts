import { useEffect, useState } from "react";

const COPY_FEEDBACK_DURATION_MS = 1_500;

export function useCopyToClipboard(text: string) {
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timerId = window.setTimeout(
      () => setIsCopied(false),
      COPY_FEEDBACK_DURATION_MS,
    );
    return () => window.clearTimeout(timerId);
  }, [isCopied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setCopyError(false);
    } catch {
      setIsCopied(false);
      setCopyError(true);
    }
  };

  return { isCopied, copyError, copy };
}
