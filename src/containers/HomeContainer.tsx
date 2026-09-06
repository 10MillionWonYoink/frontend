import { useNavigate } from "react-router-dom";
import { HomeHero } from "../components/home/HomeHero";
import { RoomActions } from "../components/home/RoomActions";
import { RoomList } from "../components/home/RoomList";
import { useMe } from "../hooks/use-me";
import { useCreateRoom, useJoinRoom, useRooms } from "../hooks/room/use-rooms";
import { getApiErrorMessage } from "../utils/get-api-error-message";

const DEFAULT_MAX_PLAYERS = 6;
const DEFAULT_TURN_SECONDS = 60;
const DEFAULT_TOTAL_ROUNDS = 3;

export function HomeContainer() {
  const navigate = useNavigate();
  const meQuery = useMe();
  const roomsQuery = useRooms();
  const createRoomMutation = useCreateRoom();
  const joinRoomMutation = useJoinRoom();

  const handleCreate = (title: string) => {
    createRoomMutation.mutate(
      {
        title,
        maxPlayers: DEFAULT_MAX_PLAYERS,
        turnSeconds: DEFAULT_TURN_SECONDS,
        totalRounds: DEFAULT_TOTAL_ROUNDS,
      },
      { onSuccess: (room) => navigate(`/rooms/${room.id}`) },
    );
  };

  const handleJoin = (invitationCode: string) => {
    joinRoomMutation.mutate(
      { invitationCode },
      { onSuccess: ({ roomId }) => navigate(`/rooms/${roomId}`) },
    );
  };

  const actionError = createRoomMutation.error ?? joinRoomMutation.error;

  return (
    <>
      <HomeHero nickname={meQuery.data?.user?.nickname ?? "플레이어"} />
      <RoomActions
        isCreating={createRoomMutation.isPending}
        isJoining={joinRoomMutation.isPending}
        onCreate={handleCreate}
        onJoin={handleJoin}
      />
      {actionError && (
        <p role="alert" className="px-5 pt-3 text-xs font-semibold text-[#d93f75]">
          {getApiErrorMessage(actionError, "요청을 처리하지 못했습니다.")}
        </p>
      )}
      <section className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-7">
        <h2 className="mb-3 text-base font-black text-[#342953]">참여 가능한 게임방</h2>
        {roomsQuery.isPending && (
          <p className="text-xs text-[#8b85a8]">방을 찾고 있어요...</p>
        )}
        {roomsQuery.isError && (
          <p className="text-xs text-[#8b85a8]">게임방 목록을 불러오지 못했어요.</p>
        )}
        {roomsQuery.data && <RoomList rooms={roomsQuery.data} />}
      </section>
    </>
  );
}
