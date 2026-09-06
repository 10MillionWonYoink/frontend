function removeTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

const DEFAULT_DEVELOPMENT_API_BASE_URL = "http://localhost:3000";
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

/**
 * 로컬 개발에서는 backend의 기본 포트(3000)를 사용합니다.
 * 배포 환경에서 API URL을 주입하지 않은 경우에만 same-origin API를 사용합니다.
 */
export const API_BASE_URL = removeTrailingSlash(
  configuredApiBaseUrl ||
    (import.meta.env.DEV ? DEFAULT_DEVELOPMENT_API_BASE_URL : window.location.origin),
);

export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL?.trim()
  ? removeTrailingSlash(import.meta.env.VITE_WS_BASE_URL.trim())
  : null;
