interface GameTopicSectionProps {
  topic: string | null | undefined;
}

export function GameTopicSection({ topic }: GameTopicSectionProps) {
  if (!topic) return null;

  return (
    <section aria-labelledby="result-topic">
      <h2 id="result-topic" className="text-base font-black text-[#342953]">
        이번 게임의 주제
      </h2>
      <div className="mt-3 rounded-2xl border border-[#e9e4f7] bg-white p-4">
        <p className="text-sm font-extrabold text-[#342953]">{topic}</p>
      </div>
    </section>
  );
}
