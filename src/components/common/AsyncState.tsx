import { AlertCircle, LoaderCircle } from "lucide-react";
import { Button } from "./Button";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "불러오는 중이에요." }: LoadingStateProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-3 text-[#8b85a8]">
      <LoaderCircle className="size-7 animate-spin" aria-hidden="true" />
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center gap-3 px-5 text-center">
      <AlertCircle className="size-8 text-[#ff6b9d]" aria-hidden="true" />
      <p className="max-w-xs text-sm font-semibold text-[#5f5878]">{message}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
