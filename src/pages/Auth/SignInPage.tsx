export default function SignInPage() {
  const handleKakaoLogin = () => {
    window.location.replace(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/kakao`,
    );
  };

  return (
    <main>
      <button
        type="button"
        onClick={handleKakaoLogin}
      >
        카카오 로그인
      </button>
    </main>
  );
}
