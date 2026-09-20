import { useNavigate } from "react-router-dom";
import { SignUpForm } from "../components/auth/SignUpForm";
import { useSignup } from "../hooks/use-signup";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function SignUpContainer() {
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const handleSubmit = (nickname: string) => {
    signupMutation.mutate(
      { nickname },
      {
        onSuccess: () => navigate("/", { replace: true }),
      },
    );
  };

  const errorMessage = signupMutation.isError
    ? getApiErrorMessage(
        signupMutation.error,
        "회원가입 중 오류가 발생했습니다. 다시 카카오 로그인해주세요.",
      )
    : undefined;

  return (
    <SignUpForm
      errorMessage={errorMessage}
      isPending={signupMutation.isPending}
      onSubmit={handleSubmit}
    />
  );
}
