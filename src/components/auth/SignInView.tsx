import { FlaskConical, MessageCircle } from "lucide-react";
import { AuthIntro } from "./AuthIntro";
import { useState } from "react";

interface SignInViewProps {
  onKakaoLogin: () => void;
  onDevLogin: (accountNumber: number) => void;
  isDevLoginPending: boolean;
}

export function SignInView({
  onKakaoLogin,
  onDevLogin,
  isDevLoginPending,
}: SignInViewProps) {
  const [accountNumber, setAccountNumber] = useState(1);

  const isTestEnvironment = import.meta.env.VITE_APP_ENV === "test";

  return (
    <div className="flex w-full flex-1 flex-col justify-between px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(3.5rem,env(safe-area-inset-top))]">
      <div className="flex flex-1 items-center justify-center py-8">
        <AuthIntro />
      </div>

      <div>
        <button
          type="button"
          onClick={onKakaoLogin}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#fee500] px-5 font-extrabold text-[#191600] transition hover:bg-[#f4dc00]"
        >
          <MessageCircle className="size-5 fill-current" aria-hidden="true" />
          카카오로 3초 만에 시작하기
        </button>

        {isTestEnvironment && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <select
              aria-label="테스트 계정"
              value={accountNumber}
              disabled={isDevLoginPending}
              className="min-h-14 w-full cursor-pointer rounded-2xl border-0 bg-[#eee9ff] px-4 text-center text-sm font-extrabold text-[#4d397d] outline-none transition hover:bg-[#e4ddff] focus:ring-2 focus:ring-[#7657e8] disabled:cursor-wait disabled:opacity-60"
              onChange={(event) => setAccountNumber(Number(event.target.value))}
            >
              {Array.from({ length: 10 }, (_, index) => {
                const number = index + 1;

                return (
                  <option key={number} value={number}>
                    테스트 유저 {number}
                  </option>
                );
              })}
            </select>

            <button
              type="button"
              disabled={isDevLoginPending}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-0 bg-[#7657e8] px-3 text-sm font-extrabold text-white transition hover:bg-[#6546d7] disabled:cursor-wait disabled:opacity-60"
              onClick={() => onDevLogin(accountNumber)}
            >
              <FlaskConical className="size-5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {isDevLoginPending ? "로그인 중..." : "테스트 로그인"}
              </span>
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] leading-5 text-[#aaa4bc]">
          로그인하면 서비스 이용약관과 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
