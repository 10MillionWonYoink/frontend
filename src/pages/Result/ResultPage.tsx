import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const scores = [
  ["유사도", 87],
  ["창의성", 72],
  ["억지 정도", 31],
] as const;

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold">
            PHOTO RELAY
          </Link>
          <span className="text-sm text-neutral-500">AI ANALYSIS</span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-12">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="size-5" />
            <span className="font-semibold">판정 성공</span>
          </div>

          <h1 className="mt-5 text-5xl font-bold tracking-tight">먼지와 연결됐어요.</h1>

          <p className="mt-5 max-w-xl leading-7 text-neutral-400">
            사진에서 먼지와 관련된 특징을 확인했습니다. 이번 결과를 바탕으로 다음 주제가
            생성됩니다.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {scores.map(([label, score]) => (
              <div
                key={label}
                className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6"
              >
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="mt-3 text-4xl font-bold">{score}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-3xl border border-neutral-800 bg-neutral-900 p-7">
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <Sparkles className="size-4" />
              NEXT TOPIC
            </div>
            <p className="mt-4 text-4xl font-bold">하수구</p>
          </div>

          <Link
            to="/relay"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-semibold text-neutral-950"
          >
            다음 릴레이로
            <ArrowRight className="size-5" />
          </Link>
        </section>
      </div>
    </main>
  );
}
