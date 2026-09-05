import axios from "axios";

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

// api.interceptors.request.use((config) => {
//   const accessToken = localStorage.getItem("accessToken");
//
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//
//   return config;
// });
