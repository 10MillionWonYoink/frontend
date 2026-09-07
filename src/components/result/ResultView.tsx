import { Home, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import type { GameResult } from "../../types/result";
import { RankingCard } from "./RankingCard";

interface ResultViewProps {
  result: GameResult;
}

export function ResultView({ result }: ResultViewProps) {
  const winner = result.rankings.find((ranking) => ranking.rank === 1);

  return (
    <>
      <header className="bg-gradient-to-br from-[#2d214d] via-[#5c42bc] to-[#a55be5] px-5 pb-8 pt-[max(2rem,env(safe-area-inset-top))] text-center text-white">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-white/15">
          <Trophy className="size-8 text-[#ffe275]" aria-hidden="true" />
        </span>
        <p className="mt-4 text-xs font-extrabold text-white/70">GAME FINISH</p>
        <h1 className="mt-1 text-2xl font-black">{result.title}</h1>
        {winner && (
          <p className="mt-2 text-sm text-white/80">
            우승은 <strong className="text-white">{winner.nickname}</strong>님! 축하해요
            🎉
          </p>
        )}
      </header>

      <div className="-mt-3 flex-1 rounded-t-3xl bg-[#fbfaff] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-[#342953]">최종 랭킹</h2>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8b85a8]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {result.totalRounds} 라운드
          </span>
        </div>

        {result.rankings.length > 0 ? (
          <ol className="mt-3 space-y-2">
            {result.rankings.map((ranking) => (
              <RankingCard key={ranking.userId} ranking={ranking} />
            ))}
          </ol>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-[#dcd5ee] px-4 py-8 text-center text-sm text-[#8b85a8]">
            집계된 결과가 없습니다.
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Link
            to={`/rooms/${result.roomId}`}
            className="inline-flex min-h-12 items-center justify-center gap-1 rounded-2xl border border-[#ded8f2] bg-white px-3 py-3 text-sm font-extrabold text-[#3d335c] transition hover:bg-[#f7f4ff]"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            같은 방으로
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-1 rounded-2xl bg-[#6c4cff] px-3 py-3 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(108,76,255,0.24)] transition hover:bg-[#5d3ee8]"
          >
            <Home className="size-4" aria-hidden="true" />
            홈으로
          </Link>
        </div>
      </div>
    </>
  );
}
