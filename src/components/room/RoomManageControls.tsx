import { useState, type FormEvent } from "react";
import type { Room } from "../../types/room";
import type { RoomUpdate } from "../../types/realtime";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";

interface RoomManageControlsProps {
  room: Room;
  disabled: boolean;
  isPending: boolean;
  error: string | null;
  onUpdate: (changes: Omit<RoomUpdate, "roomId">) => Promise<unknown>;
  onChangeHost: (userId: number) => Promise<unknown>;
}

function SettingsForm({
  room,
  isPending,
  onUpdate,
  onDone,
}: Pick<RoomManageControlsProps, "room" | "isPending" | "onUpdate"> & {
  onDone: () => void;
}) {
  const [title, setTitle] = useState(room.title);
  const [maxParticipants, setMaxParticipants] = useState(room.maxPlayers);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(room.turnSeconds);
  const [relayCount, setRelayCount] = useState(room.totalRounds);
  const [isPublic, setIsPublic] = useState(room.isPublic);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending || !title.trim()) return;
    try {
      await onUpdate({
        title: title.trim(),
        maxParticipants,
        timeLimitSeconds,
        relayCount,
        isPublic,
      });
      onDone();
    } catch {
      /* Parent mutation displays the error. */
    }
  };
  const inputClass =
    "mt-1 min-h-12 w-full rounded-xl border border-[#ded8f2] bg-white px-3";
  return (
    <form onSubmit={(event) => void submit(event)}>
      <fieldset disabled={isPending} className="space-y-4 text-sm disabled:opacity-60">
        <label className="block">
          방 이름
          <input
            required
            maxLength={100}
            className={inputClass}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className="block">
          최대 인원
          <input
            required
            type="number"
            min={Math.max(room.minPlayers, room.currentPlayers)}
            max={10}
            className={inputClass}
            value={maxParticipants}
            onChange={(event) => setMaxParticipants(event.target.valueAsNumber)}
          />
        </label>
        <label className="block">
          턴 제한 시간 (초)
          <input
            required
            type="number"
            min={10}
            max={600}
            className={inputClass}
            value={timeLimitSeconds}
            onChange={(event) => setTimeLimitSeconds(event.target.valueAsNumber)}
          />
        </label>
        <label className="block">
          릴레이 횟수
          <input
            required
            type="number"
            min={1}
            max={100}
            className={inputClass}
            value={relayCount}
            onChange={(event) => setRelayCount(event.target.valueAsNumber)}
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
          />
          공개 목록에 표시
        </label>
        <Button type="submit" fullWidth disabled={!title.trim()}>
          {isPending ? "저장 중..." : "설정 저장"}
        </Button>
      </fieldset>
    </form>
  );
}

export function RoomManageControls(props: RoomManageControlsProps) {
  const { room, disabled, isPending, error, onChangeHost } = props;
  const [mode, setMode] = useState<"settings" | "host" | null>(null);
  const [nextHost, setNextHost] = useState("");
  const close = () => setMode(null);
  const changeHost = async () => {
    if (!nextHost || isPending) return;
    try {
      await onChangeHost(Number(nextHost));
      close();
    } catch {
      /* Parent mutation displays the error. */
    }
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="ghost" disabled={disabled} onClick={() => setMode("settings")}>
          방 설정 변경
        </Button>
        <Button
          variant="ghost"
          disabled={disabled || room.players.length < 2}
          onClick={() => setMode("host")}
        >
          방장 위임
        </Button>
      </div>
      <Modal
        isOpen={mode !== null}
        title={mode === "settings" ? "방 설정 변경" : "방장 위임"}
        onClose={close}
        isBusy={isPending}
      >
        {mode === "settings" ? (
          <SettingsForm {...props} onDone={close} />
        ) : (
          <div className="space-y-4">
            <label className="block text-sm">
              새 방장
              <select
                aria-label="새 방장"
                disabled={isPending}
                className="mt-2 min-h-12 w-full rounded-xl border border-[#ded8f2] bg-white px-3"
                value={nextHost}
                onChange={(event) => setNextHost(event.target.value)}
              >
                <option value="">참여자를 선택해주세요</option>
                {room.players
                  .filter((player) => !player.isHost)
                  .map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.nickname}
                    </option>
                  ))}
              </select>
            </label>
            <p className="text-xs text-[#8b85a8]">
              선택한 참여자에게 방 설정과 시작 권한을 넘겨요.
            </p>
            <Button
              fullWidth
              disabled={!nextHost || isPending}
              onClick={() => void changeHost()}
            >
              방장 위임하기
            </Button>
          </div>
        )}
        {error && (
          <p role="alert" className="mt-3 text-sm text-[#d93f75]">
            {error}
          </p>
        )}
      </Modal>
    </>
  );
}
