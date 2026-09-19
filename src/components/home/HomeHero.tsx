interface HomeHeroProps {
  nickname: string;
}

// 홈 상단 카드의 안쪽 내용만 담당한다 — 카드 자체(높이/여백/radius/배경)는
// HomeContainer가 참여 중인 방 카드와 공유하는 하나의 wrapper에서 그린다.
export function HomeHero({ nickname }: HomeHeroProps) {
  return (
    <>
      <h1 className="text-xl font-black leading-tight tracking-[-0.03em]">
        {nickname}님, 어떤 사진을 이어볼까요?
      </h1>
      <p className="mt-1 text-xs leading-5 text-white/75">
        친구와 함께 사진을 이어보세요.
      </p>
    </>
  );
}
