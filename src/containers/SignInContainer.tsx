import { SignInView } from "../components/auth/SignInView";
import { useKakaoLogin } from "../hooks/auth/use-kakao-login";

export function SignInContainer() {
  const { startKakaoLogin } = useKakaoLogin();
  return <SignInView onKakaoLogin={startKakaoLogin} />;
}
