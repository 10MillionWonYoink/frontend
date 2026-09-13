// This is a UI-only shape for when Backend eventually provides an AI-generated
// game topic — it is not part of the current GameResult API contract.
export interface GameTopic {
  title: string;
  description?: string;
  imageUrl?: string | null;
}

interface GameTopicSectionProps {
  topic?: GameTopic;
}

export function GameTopicSection({ topic }: GameTopicSectionProps) {
  if (!topic) return null;

  return (
    <section aria-labelledby="result-topic">
      <h2 id="result-topic" className="text-base font-black text-[#342953]">
        이번 게임의 주제
      </h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-[#e9e4f7] bg-white">
        {topic.imageUrl && (
          <img src={topic.imageUrl} alt="" className="aspect-video w-full object-cover" />
        )}
        <div className="p-4">
          <p className="text-sm font-extrabold text-[#342953]">{topic.title}</p>
          {topic.description && (
            <p className="mt-1 text-xs text-[#8b85a8]">{topic.description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
