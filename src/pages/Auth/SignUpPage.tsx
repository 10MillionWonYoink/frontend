import axios from "axios";
import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client.ts";

interface SignupRequest {
  nickname: string;
}

interface SignupResponse {
  message: string;
  user: {
    id: number;
    email: string | null;
    nickname: string;
  };
}

interface ErrorResponse {
  message?: string | string[];
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const message = error.response?.data.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (message) {
      return message;
    }

    if (error.response?.status === 401) {
      return "회원가입 인증이 만료되었습니다. 다시 카카오 로그인해주세요.";
    }
  }

  return "회원가입 중 오류가 발생했습니다.";
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [nickname, setNickname] = useState("");

  const signupMutation = useMutation({
    mutationFn: async (request: SignupRequest) => {
      const response = await api.post<SignupResponse>(
        "/auth/signup",
        request,
      );

      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });

      navigate("/", {
        replace: true,
      });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNickname = nickname.trim();

    if (trimmedNickname.length < 2) {
      return;
    }

    signupMutation.mutate({
      nickname: trimmedNickname,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">회원가입</h1>

          <p className="mt-2 text-sm text-neutral-500">
            서비스에서 사용할 닉네임을 입력해주세요.
          </p>
        </div>

        <input
          type="text"
          value={nickname}
          minLength={2}
          maxLength={30}
          placeholder="닉네임"
          disabled={signupMutation.isPending}
          onChange={(event) => {
            setNickname(event.target.value);
          }}
          className="rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-950"
        />

        {signupMutation.isError && (
          <p className="text-sm text-red-500">
            {getErrorMessage(signupMutation.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={
            nickname.trim().length < 2 ||
            signupMutation.isPending
          }
          className="rounded-lg bg-neutral-950 px-4 py-3 font-semibold text-white disabled:bg-neutral-300"
        >
          {signupMutation.isPending
            ? "가입 처리 중..."
            : "가입 완료"}
        </button>
      </form>
    </main>
  );
}