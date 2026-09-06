import { endpoints } from "../../api/endpoints";
import { API_BASE_URL } from "../../config/env";

export function useKakaoLogin() {
  const startKakaoLogin = () => {
    window.location.replace(`${API_BASE_URL}/api${endpoints.auth.kakao}`);
  };

  return { startKakaoLogin };
}
