import { Camera } from "lucide-react";

interface HomeHeroProps {
  nickname: string;
}

export function HomeHero({ nickname }: HomeHeroProps) {
  return (
    <section className="px-5 pb-6 pt-5">
      <div className="rounded-[2rem] bg-gradient-to-br from-[#6c4cff] via-[#8065ff] to-[#ff78a7] p-6 text-white shadow-[0_16px_45px_rgba(108,76,255,0.25)]">
        <div className="flex items-center gap-1.5 text-[11px] font-black tracking-[0.06em] text-white/85">
          <Camera className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">PICYOINK · 함께 이어 만드는 실시간 포토 릴레이</span>
        </div>
        <h1 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em]">
          {nickname}님,
          <br />
          어떤 사진을 이어볼까요?
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/75">
          방을 만들거나 초대 코드로 친구의 릴레이에 참여하세요.
        </p>
      </div>
    </section>
  );
}
