import axios from "axios";

interface ErrorResponse {
  message?: string | string[];
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (!axios.isAxiosError<ErrorResponse>(error)) {
    return fallbackMessage;
  }

  const message = error.response?.data.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message ?? fallbackMessage;
}
