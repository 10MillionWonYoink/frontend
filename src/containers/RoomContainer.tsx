import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { Button } from "../components/common/Button";
import { RoomLobbyView } from "../components/room/RoomLobbyView";
import { useRoomLobby } from "../hooks/room/use-room-lobby";
import { getApiErrorMessage } from "../utils/get-api-error-message";
import { isValidRoomId } from "../utils/is-valid-room-id";

export function RoomContainer() {
  const navigate = useNavigate();
  const { roomId = "" } = useParams();
  const lobby = useRoomLobby(roomId);
  useEffect(() => {
    if (lobby.room?.status === "PLAYING")
      navigate(`/rooms/${roomId}/game`, { replace: true });
    if (lobby.socket.roomClosed) navigate("/", { replace: true });
  }, [lobby.room?.status, lobby.socket.roomClosed, navigate, roomId]);
  if (!isValidRoomId(roomId))
    return <ErrorState message="게임방 주소가 올바르지 않습니다." />;
  if (lobby.isPending) return <LoadingState message="게임방에 입장하고 있어요." />;
  if (lobby.roomError || !lobby.room)
    return (
      <>
        <ErrorState
          message={getApiErrorMessage(
            lobby.roomError,
            "게임방 정보를 불러오지 못했습니다.",
          )}
          onRetry={() => void lobby.refetchRoom()}
        />
        <Button variant="ghost" onClick={() => navigate("/")}>
          홈으로
        </Button>
      </>
    );
  const handleLeave = async () => {
    if (!lobby.currentPlayer || lobby.room?.status !== "WAITING") {
      navigate("/");
      return;
    }
    try {
      await lobby.leave();
      navigate("/", { replace: true });
    } catch {
      /* Show mutation error without pretending the user left. */
    }
  };
  return (
    <RoomLobbyView
      room={lobby.room}
      currentPlayer={lobby.currentPlayer}
      isMutating={lobby.isMutating}
      socketStatus={lobby.socket.status}
      actionError={lobby.actionError}
      onReconnect={lobby.socket.reconnect}
      onLeave={() => void handleLeave()}
      onReadyChange={lobby.setReady}
      onUpdateRoom={lobby.updateRoom}
      onChangeHost={lobby.changeHost}
    />
  );
}
