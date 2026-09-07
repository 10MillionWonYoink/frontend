import { Clock3 } from "lucide-react";

const WARNING_THRESHOLD_SECONDS = 10;

interface TimerProps {
  seconds: number;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function Timer({ seconds }: TimerProps) {
  const isWarning = seconds <= WARNING_THRESHOLD_SECONDS;

  return (
    <span
      aria-label={`남은 시간 ${seconds}초`}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-black ${
        isWarning ? "bg-[#ffe1eb] text-[#d93f75]" : "bg-[#d8f7ef] text-[#008d78]"
      }`}
    >
      <Clock3 className="size-4" aria-hidden="true" />
      {formatTime(seconds)}
    </span>
  );
}
