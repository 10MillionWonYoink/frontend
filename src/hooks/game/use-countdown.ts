import { useEffect, useState } from "react";

const TICK_INTERVAL_MS = 1_000;

function computeRemainingSeconds(expiresAt: string | null | undefined): number {
  if (!expiresAt) return 0;
  return Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

// expiresAt(턴마다 새로 발급되는 고유한 시각 문자열)을 리셋 기준으로 삼는다.
// 예전엔 "현재 남은 초"라는 계산된 정수를 리셋 의존성으로 썼는데, 모든 턴이
// 같은 제한 시간을 쓰는 한 그 정수는 턴이 바뀌어도 거의 항상 같은 값(예: 30)이
// 되어 버려서, 값이 안 바뀌었다고 판단한 React가 리셋 effect를 건너뛰고 이전
// 턴에서 이어지던 카운트를 그대로 흘려보내는 버그가 있었다 — expiresAt은 턴마다
// 실제로 다른 값이라 이 문제가 생기지 않는다.
export function useCountdown(expiresAt: string | null | undefined, isPaused: boolean) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    computeRemainingSeconds(expiresAt),
  );

  useEffect(() => {
    setRemainingSeconds(computeRemainingSeconds(expiresAt));
  }, [expiresAt]);

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
