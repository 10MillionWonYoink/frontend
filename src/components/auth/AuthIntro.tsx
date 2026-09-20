import { Camera, Sparkles } from "lucide-react";

export function AuthIntro() {
  return (
    <div className="text-center">
      <div className="mx-auto grid size-20 place-items-center rounded-[1.75rem] bg-gradient-to-br from-[#7c5cff] to-[#ff6b9d] text-white shadow-[0_18px_45px_rgba(108,76,255,0.3)]">
        <Camera className="size-9" aria-hidden="true" />
      </div>
      <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[#ebe5ff] px-3 py-1 text-xs font-extrabold text-[#6c4cff]">
        <Sparkles className="size-3.5" aria-hidden="true" />
        AI PICYOINK
      </div>
      <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#2c2345]">
        사진으로 이어지는
        <br />
        우리만의 릴레이
      </h1>
      <p className="mt-3 text-sm leading-6 text-[#8b85a8]">
        친구들과 미션 사진을 찍고
        <br />
        AI의 재치 있는 평가를 만나보세요.
      </p>
    </div>
  );
}
