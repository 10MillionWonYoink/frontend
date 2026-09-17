interface GameTopicSectionProps {
  topic: string | null | undefined;
  title?: string;
}

export function GameTopicSection({
  topic,
  title = "이번 게임의 주제",
}: GameTopicSectionProps) {
  if (!topic) return null;

  return (
    <section aria-labelledby="result-topic">
      <h2 id="result-topic" className="text-base font-black text-[#342953]">
        {title}
      </h2>
      <div className="mt-3 rounded-2xl border border-[#e9e4f7] bg-white p-4">
        <p className="text-sm font-extrabold text-[#342953]">{topic}</p>
      </div>
    </section>
  );
}
