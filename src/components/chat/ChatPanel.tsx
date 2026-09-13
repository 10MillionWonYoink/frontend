import { MessageCircle, Send } from "lucide-react";
import { Button } from "../common/Button";
import { Avatar } from "../common/Avatar";

export interface ChatParticipant {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}
export interface ChatMessage {
  id: string;
  sender: ChatParticipant;
  text: string;
  sentAt: string;
}
interface ChatPanelProps {
  title?: string;
  messages?: readonly ChatMessage[];
}

export function ChatPanel({
  title = "친구들과 나눌 이야기",
  messages = [],
}: ChatPanelProps) {
  return (
    <section aria-label={title} className="space-y-4">
      <div
        role="log"
        aria-label="대화 내용"
        className="min-h-44 space-y-3 rounded-2xl bg-[#f1eef9] p-4"
      >
        {messages.length ? (
          messages.map((message) => (
            <article key={message.id} className="flex items-start gap-2">
              <Avatar
                nickname={message.sender.nickname}
                imageUrl={message.sender.profileImageUrl}
                size="small"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold">{message.sender.nickname}</p>
                <p className="mt-1 whitespace-pre-wrap break-words rounded-xl bg-white p-3 text-sm">
                  {message.text}
                </p>
                <time dateTime={message.sentAt} className="text-[10px] text-[#8b85a8]">
                  {new Date(message.sentAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            </article>
          ))
        ) : (
          <div className="flex min-h-36 flex-col items-center justify-center text-center text-[#8b85a8]">
            <MessageCircle className="mb-3 size-8 text-[#b9aaf8]" aria-hidden="true" />
            <h3 className="text-sm font-bold">메시지 기능을 준비하고 있어요</h3>
            <p className="mt-2 text-xs leading-5">
              친구들과 대화할 수 있도록 준비 중이에요.
              <br />
              아직 메시지를 주고받을 수 없어요.
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          disabled
          aria-label="메시지 입력 (준비 중)"
          placeholder="메시지 기능 준비 중"
          className="min-w-0 flex-1 rounded-xl border border-[#ded8f2] px-3 text-sm"
        />
        <Button disabled aria-label="메시지 보내기 (준비 중)">
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
