import { ArrowDown, LoaderCircle, MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Avatar } from "../common/Avatar";
import type { ChatMessage } from "../../types/chat";

interface ChatPanelProps {
  title?: string;
  messages: ChatMessage[];
  meUserId?: number;
  isLoadingHistory?: boolean;
  onSend: (content: string) => Promise<unknown>;
  isSending?: boolean;
  sendError?: string;
  // 게임 진행 화면처럼 채팅이 주 화면을 방해하면 안 되는 곳에서 로그 영역 높이만
  // 줄여서 쓰는 미니 모드. 그 외 동작(전송/수신/페이지네이션)은 동일하다.
  compact?: boolean;
  // Modal에 담겨 있어 title이 이미 Modal 헤더로 보이는 경우(Home 전체 채팅)
  // 제목이 중복 표시되지 않도록 끈다.
  showTitle?: boolean;
}

// 로그 하단에서 이 정도(px) 안에 있으면 "최신 영역을 보고 있다"로 간주한다.
const NEAR_BOTTOM_THRESHOLD_PX = 80;

export function ChatPanel({
  title = "친구들과 나눌 이야기",
  messages,
  meUserId,
  isLoadingHistory = false,
  onSend,
  isSending = false,
  sendError,
  compact = false,
  showTitle = true,
}: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const lastMessageIdRef = useRef<number | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior) => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  };

  const handleScroll = () => {
    const el = logRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_THRESHOLD_PX;
    if (isNearBottomRef.current) setHasNewMessage(false);
  };

  // "이전 메시지 더 보기"는 배열 앞쪽에 과거 메시지를 끼워 넣는 것이라 가장 최신
  // 메시지의 id는 그대로다 — 그 경우엔 화면을 아래로 끌어내리지 않는다. 반대로
  // 맨 뒤에 진짜 새 메시지가 붙었을 때만(내가 보냈거나, 이미 최신 영역을 보고
  // 있었을 때) 자동으로 따라 내려가고, 아니면 "새 메시지" 버튼만 띄운다.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last) return;
    const isFirstLoad = lastMessageIdRef.current === null;
    const isNewAppended = last.id !== lastMessageIdRef.current;
    lastMessageIdRef.current = last.id;
    if (!isNewAppended) return;
    if (isFirstLoad || last.userId === meUserId || isNearBottomRef.current) {
      scrollToBottom(isFirstLoad ? "auto" : "smooth");
      setHasNewMessage(false);
    } else {
      setHasNewMessage(true);
    }
  }, [messages, meUserId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isSending) return;
    try {
      await onSend(content);
      setDraft("");
    } catch {
      /* Error surfaced below via sendError; draft stays so the user can retry. */
    }
  };

  return (
    <section aria-label={title} className="space-y-2">
      {showTitle && (
        <h2
          className={
            compact ? "text-xs font-black text-[#342953]" : "text-sm font-black text-[#342953]"
          }
        >
          {title}
        </h2>
      )}
      {/* 로그 + 입력창을 하나의 둥근 상자로 묶어서 하나의 채팅 컴포넌트처럼 보이게 한다. */}
      <div className="overflow-hidden rounded-2xl border border-[#e4defa]">
        <div className="relative">
          <div
            ref={logRef}
            onScroll={handleScroll}
            role="log"
            aria-label="대화 내용"
            className={`flex flex-col gap-3 overflow-y-auto bg-[#f1eef9] p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              compact ? "min-h-20 max-h-36" : "min-h-44 max-h-80"
            }`}
          >
            {isLoadingHistory ? (
              <div className="flex min-h-16 flex-col items-center justify-center text-[#8b85a8]">
                <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
              </div>
            ) : messages.length ? (
              messages.map((message) => {
                const isMine = message.userId === meUserId;
                return (
                  <article
                    key={message.id}
                    className={`flex items-start gap-2 ${isMine ? "flex-row-reverse" : ""}`}
                  >
                    {!compact && (
                      <Avatar
                        nickname={message.nickname}
                        imageUrl={message.profileImageUrl}
                        size="small"
                      />
                    )}
                    <div className={`min-w-0 ${isMine ? "text-right" : ""}`}>
                      <p className="text-xs font-bold">{isMine ? "나" : message.nickname}</p>
                      <p
                        className={`mt-1 whitespace-pre-wrap break-words rounded-xl bg-white text-left text-sm ${compact ? "px-2.5 py-1.5" : "p-3"}`}
                      >
                        {message.content}
                      </p>
                      {!compact && (
                        <time
                          dateTime={message.createdAt}
                          className="text-[10px] text-[#8b85a8]"
                        >
                          {new Date(message.createdAt).toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="flex min-h-16 flex-col items-center justify-center text-center text-[#8b85a8]">
                {!compact && (
                  <MessageCircle className="mb-3 size-8 text-[#b9aaf8]" aria-hidden="true" />
                )}
                <h3 className="text-sm font-bold">아직 메시지가 없어요</h3>
                {!compact && <p className="mt-2 text-xs leading-5">첫 메시지를 남겨보세요.</p>}
              </div>
            )}
          </div>
          {/* 채팅 영역 내부 하단 중앙 — 페이지 전체가 아니라 이 로그 영역 기준으로 뜬다. */}
          {hasNewMessage && (
            <button
              type="button"
              onClick={() => scrollToBottom("smooth")}
              aria-label="새 메시지로 이동"
              className="absolute bottom-2 left-1/2 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-[#6c4cff] text-white shadow-[0_6px_16px_rgba(108,76,255,0.35)]"
            >
              <ArrowDown className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex gap-2 border-t border-[#e4defa] bg-white p-3"
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="메시지 입력"
            placeholder="메시지를 입력하세요"
            maxLength={500}
            disabled={isSending}
            className="min-w-0 flex-1 rounded-xl border border-[#ded8f2] px-3 text-sm disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending || !draft.trim()}
            aria-label="메시지 보내기"
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#6c4cff] text-white disabled:opacity-50"
          >
            <Send className="size-4" aria-hidden="true" />
          </button>
        </form>
      </div>
      {sendError && (
        <p role="alert" className="text-xs font-bold text-[#d93f75]">
          {sendError}
        </p>
      )}
    </section>
  );
}
