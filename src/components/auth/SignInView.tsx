import { MessageCircle } from "lucide-react";
import { AuthIntro } from "./AuthIntro";

interface SignInViewProps {
  onKakaoLogin: () => void;
}

export function SignInView({ onKakaoLogin }: SignInViewProps) {
  return (
    <div className="flex flex-1 flex-col justify-between px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-14">
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
        <p className="mt-4 text-center text-[11px] leading-5 text-[#aaa4bc]">
          로그인하면 서비스 이용약관과 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
