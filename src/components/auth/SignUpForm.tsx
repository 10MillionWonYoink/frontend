import { useState, type FormEvent } from "react";
import { Button } from "../common/Button";

const MIN_NICKNAME_LENGTH = 2;
const MAX_NICKNAME_LENGTH = 30;

interface SignUpFormProps {
  errorMessage?: string;
  isPending: boolean;
  onSubmit: (nickname: string) => void;
}

export function SignUpForm({ errorMessage, isPending, onSubmit }: SignUpFormProps) {
  const [nickname, setNickname] = useState("");
  const trimmedNickname = nickname.trim();
  const isValid = trimmedNickname.length >= MIN_NICKNAME_LENGTH;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValid) {
      onSubmit(trimmedNickname);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-6 pb-6 pt-10">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#ebe5ff] text-3xl">
        👋
      </div>
      <div className="mt-6 text-center">
        <p className="text-xs font-extrabold text-[#6c4cff]">마지막 한 단계</p>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#2c2345]">
          어떤 이름으로 불러드릴까요?
        </h1>
        <p className="mt-2 text-sm text-[#8b85a8]">
          게임에서 사용할 닉네임을 입력해주세요.
        </p>
      </div>

      <label className="mt-10 text-sm font-extrabold text-[#4d4565]" htmlFor="nickname">
        닉네임
      </label>
      <input
        id="nickname"
        type="text"
        value={nickname}
        minLength={MIN_NICKNAME_LENGTH}
        maxLength={MAX_NICKNAME_LENGTH}
        autoComplete="nickname"
        placeholder="2자 이상 입력해주세요"
        disabled={isPending}
        onChange={(event) => setNickname(event.target.value)}
        className="mt-2 min-h-14 rounded-2xl border border-[#ded8f2] bg-white px-4 text-[#2c2345] outline-none transition placeholder:text-[#bbb5cb] focus:border-[#6c4cff] focus:ring-4 focus:ring-[#6c4cff]/10"
      />
      <div className="mt-2 flex justify-between text-xs text-[#9c96ae]">
        <span>{errorMessage ?? "친구들이 알아보기 쉬운 이름이 좋아요."}</span>
        <span>
          {nickname.length}/{MAX_NICKNAME_LENGTH}
        </span>
      </div>

      <Button
        type="submit"
        fullWidth
        disabled={!isValid || isPending}
        className="mt-auto min-h-14"
      >
        {isPending ? "가입 처리 중..." : "사진 릴레이 시작하기"}
      </Button>
    </form>
  );
}
