import type { Room } from "../../types/room";
import { Card } from "../common/Card";

interface RoomSettingsProps {
  room: Room;
}

export function RoomSettings({ room }: RoomSettingsProps) {
  const settings = [
    ["턴 당 제한 시간", `${room.turnSeconds}초`],
    ["총 라운드", `${room.totalRounds}라운드`],
    ["최대 참여 인원", `${room.maxPlayers}명`],
  ] as const;

  return (
    <Card>
      <h2 className="text-sm font-black text-[#342953]">게임 설정 ⚙️</h2>
      <dl className="mt-2">
        {settings.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between border-t border-[#eeeaf8] py-2.5 text-xs first:border-t-0"
          >
            <dt className="text-[#8b85a8]">{label}</dt>
            <dd className="font-extrabold text-[#4d4565]">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
