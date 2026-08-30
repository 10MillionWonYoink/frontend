import { ArrowRight, Camera, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  ["01", "사진 촬영", "주어진 주제에 맞는 사진을 제한시간 안에 찍습니다."],
  ["02", "AI 분석", "AI가 사진을 판정하고 유사도와 창의성을 평가합니다."],
  ["03", "다음 주제", "분석 결과를 바탕으로 예상하지 못한 주제가 이어집니다."],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="mb-8 flex items-center gap-2 text-sm font-medium text-neutral-400">
          <Sparkles className="size-4" />
          AI PHOTO RELAY
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          사진 한 장으로
          <br />
          예측할 수 없는 릴레이를 시작하세요.
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-400">
          사진을 AI가 분석하고, 그 결과로 다음 사람이 찍어야 할 주제를 만들어냅니다.
          강아지에서 먼지, 먼지에서 하수구까지. 어디로 이어질지는 아무도 모릅니다.
        </p>

        <div className="mt-10">
          <Link
            to="/relay"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-neutral-950 transition hover:bg-neutral-200"
          >
            <Camera className="size-5" />
            릴레이 시작
            <ArrowRight className="size-5" />
          </Link>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <div
              key={number}
              className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6"
            >
              <span className="text-sm text-neutral-500">{number}</span>
              <h2 className="mt-8 text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-400">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
