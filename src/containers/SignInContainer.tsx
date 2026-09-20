import { getApiErrorMessage } from "../utils/get-api-error-message";
import { SignInView } from "../components/auth/SignInView";
import { useKakaoLogin } from "../hooks/auth/use-kakao-login";
import { useDevLogin } from "../hooks/auth/use-dev-login.ts";
import { FullScreenLoading } from "../components/common/FullScreenLoading.tsx";

export function SignInContainer() {
  const devLoginMutation = useDevLogin();
  const handleDevLogin = (accountNumber: number) => {
    devLoginMutation.mutate(accountNumber, {
      onSuccess: () => {
        window.location.replace("/");
      },
    });
  };
  const { startKakaoLogin } = useKakaoLogin();

  return (
    <>
      <SignInView
        onKakaoLogin={startKakaoLogin}
        onDevLogin={handleDevLogin}
        isDevLoginPending={devLoginMutation.isPending}
      />

      {devLoginMutation.error && (
        <p role="alert" className="px-5 pb-4 text-sm text-[#d93f75]">
          {getApiErrorMessage(devLoginMutation.error, "로그인하지 못했습니다.")}
        </p>
      )}

      <FullScreenLoading
        isOpen={devLoginMutation.isPending}
        message="테스트 계정으로 로그인하고 있어요..."
      />
    </>
  );
}
