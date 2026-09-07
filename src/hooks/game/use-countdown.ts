import { useEffect, useState } from "react";

const TICK_INTERVAL_MS = 1_000;

export function useCountdown(initialSeconds: number, isPaused: boolean) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused || remainingSeconds <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setRemainingSeconds((currentSeconds) => Math.max(0, currentSeconds - 1));
    }, TICK_INTERVAL_MS);

    return () => window.clearTimeout(timerId);
  }, [isPaused, remainingSeconds]);

  return remainingSeconds;
}
