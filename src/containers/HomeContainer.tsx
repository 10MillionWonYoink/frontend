import { RefreshCw, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { HomeHero } from "../components/home/HomeHero";
import { RoomActions } from "../components/home/RoomActions";
import { RoomList } from "../components/home/RoomList";
import { LoadingState } from "../components/common/AsyncState";
import { Modal } from "../components/common/Modal";
import { ChatPanel } from "../components/chat/ChatPanel";
import { useMe } from "../hooks/use-me";
import {
  useCreateRoom,
  useJoinRoom,
  useJoinByInviteCode,
  useMyRooms,
  useRooms,
} from "../hooks/room/use-rooms";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function HomeContainer() {
  const navigate = useNavigate();
  const meQuery = useMe();
  const roomsQuery = useRooms();
  const myRoomsQuery = useMyRooms();
  const createMutation = useCreateRoom();
  const joinMutation = useJoinRoom();
  const codeMutation = useJoinByInviteCode();
  const [pendingRoomId, setPendingRoomId] = useState<number>();
  const [joinError, setJoinError] = useState<string>();
  const [chatOpen, setChatOpen] = useState(false);
  const joinedIds = new Set(myRoomsQuery.data?.map((room) => room.id));
  const handleJoin = async (roomId: number) => {
    if (pendingRoomId !== undefined) return;
    setPendingRoomId(roomId);
    setJoinError(undefined);
    try {
      await joinMutation.mutateAsync(roomId);
      navigate(`/rooms/${roomId}`);
    } catch (error) {
      setJoinError(getApiErrorMessage(error, "방에 참여하지 못했습니다."));
    } finally {
      setPendingRoomId(undefined);
    }
  };
  const refresh = () => {
    void roomsQuery.refetch();
    void myRoomsQuery.refetch();
  };
  return (
    <>
      <HomeHero nickname={meQuery.data?.user?.nickname ?? "플레이어"} />
      <RoomActions
        isCreating={createMutation.isPending}
        isJoining={codeMutation.isPending}
        createError={
          createMutation.error
            ? getApiErrorMessage(createMutation.error, "방을 만들지 못했습니다.")
            : undefined
        }
        joinError={
          codeMutation.error
            ? getApiErrorMessage(codeMutation.error, "초대 코드를 확인해주세요.")
            : undefined
        }
        onReset={() => {
          createMutation.reset();
          codeMutation.reset();
        }}
        onCreate={async (request) => {
          const response = await createMutation.mutateAsync(request);
          navigate(`/rooms/${response.room.id}`);
        }}
        onJoin={async (code) => {
          const response = await codeMutation.mutateAsync(code);
          navigate(`/rooms/${response.roomId}`);
        }}
      />
      {(myRoomsQuery.data?.length ?? 0) > 0 && (
        <section className="px-5 pt-6" aria-labelledby="my-rooms-title">
          <h2 id="my-rooms-title" className="text-sm font-black text-[#342953]">
            참여 중인 방
          </h2>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {myRoomsQuery.data?.map((room) => (
              <Link
                key={room.id}
                to={
                  room.status === "finished"
                    ? `/rooms/${room.id}/result`
                    : `/rooms/${room.id}`
                }
                className="max-w-56 shrink-0 truncate rounded-xl bg-[#eee9ff] px-3 py-3 text-xs font-bold text-[#6c4cff]"
              >
                {room.title} · {room.currentPlayers}/{room.maxPlayers}
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="px-5 pb-6 pt-6" aria-labelledby="room-list-title">
        <div className="flex items-center justify-between gap-2">
          <h2 id="room-list-title" className="text-base font-black text-[#342953]">
            참여 가능한 게임방
          </h2>
          <button
            type="button"
            onClick={refresh}
            disabled={roomsQuery.isFetching}
            className="flex min-h-10 items-center gap-1 text-xs font-bold text-[#6c4cff]"
          >
            <RefreshCw
              className={roomsQuery.isFetching ? "size-3.5 animate-spin" : "size-3.5"}
              aria-hidden="true"
            />
            새로고침
          </button>
        </div>
        <p className="mb-4 text-[11px] text-[#8b85a8]" aria-live="polite">
          최신순 · 1분마다 자동 갱신
          {roomsQuery.dataUpdatedAt > 0 &&
            " · " +
              new Date(roomsQuery.dataUpdatedAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              }) +
              " 확인"}
        </p>
        {roomsQuery.isPending && <LoadingState message="게임방을 찾고 있어요." />}
        {roomsQuery.isError && (
          <p role="alert" className="mb-3 text-sm text-[#d93f75]">
            목록을 갱신하지 못했어요. 새로고침으로 다시 확인해주세요.
          </p>
        )}
        {joinError && (
          <p role="alert" className="mb-3 text-sm text-[#d93f75]">
            {joinError}
          </p>
        )}
        {roomsQuery.data && (
          <RoomList
            rooms={roomsQuery.data}
            onJoin={(roomId) => void handleJoin(roomId)}
            joinedIds={joinedIds}
            pendingRoomId={pendingRoomId}
            disabled={pendingRoomId !== undefined}
          />
        )}
      </section>
      <div className="mt-auto px-5 pb-6">
        <button
          type="button"
          onClick={() => setChatOpen(true)}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#ded8f2] text-sm text-[#8b85a8]"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          메시지 · 준비 중
        </button>
      </div>
      <Modal isOpen={chatOpen} onClose={() => setChatOpen(false)} title="메시지">
        <ChatPanel />
      </Modal>
    </>
  );
}
