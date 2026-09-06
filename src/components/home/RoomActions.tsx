import { Plus, TicketCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";

const INVITATION_CODE_MAX_LENGTH = 12;

interface RoomActionsProps {
  isCreating: boolean;
  isJoining: boolean;
  onCreate: (title: string) => void;
  onJoin: (invitationCode: string) => void;
}

export function RoomActions({
  isCreating,
  isJoining,
  onCreate,
  onJoin,
}: RoomActionsProps) {
  const [roomTitle, setRoomTitle] = useState("");
  const [invitationCode, setInvitationCode] = useState("");

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = roomTitle.trim();
    if (title) {
      onCreate(title);
    }
  };

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = invitationCode.trim().toUpperCase();
    if (code) {
      onJoin(code);
    }
  };

  return (
    <section className="space-y-3 px-5" aria-labelledby="room-actions-title">
      <h2 id="room-actions-title" className="text-base font-black text-[#342953]">
        게임 시작하기
      </h2>
      <Card className="bg-gradient-to-br from-[#f0ebff] to-white">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#6c4cff] text-white">
            <Plus className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-black text-[#342953]">새 게임방 만들기</h3>
            <p className="mt-0.5 text-xs text-[#8b85a8]">
              친구를 초대할 방을 만들어요.
            </p>
          </div>
        </div>
        <form className="mt-4 flex gap-2" onSubmit={handleCreate}>
          <input
            value={roomTitle}
            onChange={(event) => setRoomTitle(event.target.value)}
            placeholder="방 이름"
            aria-label="방 이름"
            maxLength={30}
            className="min-w-0 flex-1 rounded-xl border border-[#ded8f2] bg-white px-3 text-sm outline-none focus:border-[#6c4cff]"
          />
          <Button
            type="submit"
            disabled={!roomTitle.trim() || isCreating}
            className="px-4"
          >
            {isCreating ? "생성 중" : "만들기"}
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#ffe1eb] text-[#d93f75]">
            <TicketCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-black text-[#342953]">초대 코드로 참여</h3>
            <p className="mt-0.5 text-xs text-[#8b85a8]">
              받은 코드를 입력해 바로 입장해요.
            </p>
          </div>
        </div>
        <form className="mt-4 flex gap-2" onSubmit={handleJoin}>
          <input
            value={invitationCode}
            onChange={(event) => setInvitationCode(event.target.value.toUpperCase())}
            placeholder="예: RELAY7"
            aria-label="초대 코드"
            maxLength={INVITATION_CODE_MAX_LENGTH}
            autoCapitalize="characters"
            className="min-w-0 flex-1 rounded-xl border border-[#ded8f2] bg-white px-3 text-sm font-bold tracking-widest uppercase outline-none focus:border-[#6c4cff]"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={!invitationCode.trim() || isJoining}
            className="px-4"
          >
            {isJoining ? "입장 중" : "참여"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
