import { Medal } from "lucide-react";

// 1~3위는 "N위" 텍스트를 항상 함께 보여줘서(아이콘만으로 구분하지 않음) 색만으로
// 순위를 추측하지 않게 하고, 같은 보라색 계열 안에서 진하기로 1>2>3위를 차등 표현한다.
// 4위 이후는 메달 없이 숫자 순위만 사용.
const TOP_RANK_STYLE: Record<number, string> = {
  1: "bg-[#6c4cff] text-white",
  2: "bg-[#c9bdfb] text-[#3d2894]",
  3: "bg-[#e6e0fb] text-[#5638d1]",
};

export function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f4f2f9] text-xs font-black text-[#8b85a8]">
        {rank}위
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1.5 text-[11px] font-black ${TOP_RANK_STYLE[rank]}`}
    >
      <Medal className="size-3.5" aria-hidden="true" />
      {rank}위
    </span>
  );
}
