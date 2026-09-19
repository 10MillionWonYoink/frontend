import { Plus, TicketCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { CreateRoomRequest } from "../../types/room";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";

interface RoomActionsProps {
  isCreating: boolean;
  isJoining: boolean;
  hasActiveRoom: boolean;
  createError?: string;
  joinError?: string;
  onCreate: (request: CreateRoomRequest) => Promise<void>;
  onJoin: (invitationCode: string) => Promise<void>;
  onReset: () => void;
}

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-[#ded8f2] bg-white px-3 text-sm outline-none focus:border-[#6c4cff]";

export function RoomActions({
  isCreating,
  isJoining,
  hasActiveRoom,
  createError,
  joinError,
  onCreate,
  onJoin,
  onReset,
}: RoomActionsProps) {
  const [mode, setMode] = useState<"create" | "join" | null>(null);
  const [roomTitle, setRoomTitle] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(6);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(60);
  const [relayCount, setRelayCount] = useState(3);
  const [isPublic, setIsPublic] = useState(true);
  const isBusy = isCreating || isJoining;
  const open = (next: "create" | "join") => {
    onReset();
    setMode(next);
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;
    try {
      if (mode === "create") {
        if (!roomTitle.trim()) return;
        await onCreate({
          title: roomTitle.trim(),
          maxParticipants,
          timeLimitSeconds,
          relayCount,
          isPublic,
        });
      } else {
        if (!invitationCode.trim()) return;
        await onJoin(invitationCode.trim());
      }
      setMode(null);
    } catch {
      /* Mutation errors remain visible in the modal. */
    }
  };
  return (
    <section className="px-5" aria-label="게임방 만들기와 참여">
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => open("create")}
          disabled={hasActiveRoom}
          fullWidth
          className="min-h-14 gap-1.5 text-base"
        >
          <Plus className="size-5" aria-hidden="true" />새 게임방
        </Button>
        <Button
          onClick={() => open("join")}
          variant="secondary"
          fullWidth
          className="min-h-14 gap-1.5 text-base"
        >
          <TicketCheck className="size-5" aria-hidden="true" />
          초대 코드 참여
        </Button>
      </div>
      <Modal
        isOpen={mode !== null}
        title={mode === "create" ? "새 게임방 만들기" : "초대 코드로 참여"}
        onClose={() => setMode(null)}
        isBusy={isBusy}
      >
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
          <fieldset disabled={isBusy} className="space-y-4 disabled:opacity-60">
            {mode === "create" ? (
              <>
                <label className="block text-xs font-bold">
                  방 이름
                  <input
                    className={inputClass}
                    value={roomTitle}
                    onChange={(event) => setRoomTitle(event.target.value)}
                    maxLength={100}
                    required
                    placeholder="친구들과 함께할 릴레이"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs font-bold">
                    최대 인원
                    <input
                      type="number"
                      min={2}
                      max={10}
                      required
                      className={inputClass}
                      value={maxParticipants}
                      onChange={(event) =>
                        setMaxParticipants(event.target.valueAsNumber)
                      }
                    />
                  </label>
                  <label className="text-xs font-bold">
                    릴레이 횟수
                    <input
                      type="number"
                      min={1}
                      max={100}
                      required
                      className={inputClass}
                      value={relayCount}
                      onChange={(event) => setRelayCount(event.target.valueAsNumber)}
                    />
                  </label>
                </div>
                <label className="block text-xs font-bold">
                  턴 제한 시간 (초)
                  <input
                    type="number"
                    min={10}
                    max={600}
                    required
                    className={inputClass}
                    value={timeLimitSeconds}
                    onChange={(event) =>
                      setTimeLimitSeconds(event.target.valueAsNumber)
                    }
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(event) => setIsPublic(event.target.checked)}
                    className="size-4 accent-[#6c4cff]"
                  />
                  공개 목록에 표시
                </label>
              </>
            ) : (
              <>
                <p className="text-sm leading-6 text-[#8b85a8]">
                  친구에게 받은 초대 코드를 그대로 붙여넣어 주세요.
                </p>
                <label className="block text-xs font-bold">
                  초대 코드
                  <input
                    className={inputClass + " font-mono"}
                    value={invitationCode}
                    onChange={(event) => setInvitationCode(event.target.value)}
                    maxLength={20}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="예: b3fec712345678d2"
                  />
                </label>
              </>
            )}
          </fieldset>
          {(mode === "create" ? createError : joinError) && (
            <p role="alert" className="text-sm text-[#d93f75]">
              {mode === "create" ? createError : joinError}
            </p>
          )}
          <Button
            type="submit"
            fullWidth
            disabled={
              isBusy || !(mode === "create" ? roomTitle.trim() : invitationCode.trim())
            }
          >
            {isBusy ? "처리 중..." : mode === "create" ? "방 만들기" : "참여하기"}
          </Button>
        </form>
      </Modal>
    </section>
  );
}
