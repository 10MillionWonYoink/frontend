import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    "VITE_API_URL 환경변수가 없습니다.",
  );
}

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

const refreshApi = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  timeout: 10_000,
});

interface RetryRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<void> | null =
  null;

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | RetryRequestConfig
        | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // 여러 API가 동시에 401이어도 refresh 요청은 한 번만 실행
      if (!refreshPromise) {
        refreshPromise = refreshApi
          .post('/auth/refresh')
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;

      // 새 쿠키로 기존 API 다시 요청
      return api.request(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);