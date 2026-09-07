import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { RoomLobbyView } from "../components/room/RoomLobbyView";
import { useRoomLobby } from "../hooks/room/use-room-lobby";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function RoomContainer() {
  const navigate = useNavigate();
  const { roomId = "" } = useParams();
  const lobby = useRoomLobby(roomId);

  useEffect(() => {
    if (lobby.room?.status === "PLAYING") {
      navigate(`/rooms/${roomId}/game`, { replace: true });
    }
  }, [lobby.room?.status, navigate, roomId]);

  if (!roomId) {
    return <ErrorState message="게임방 주소가 올바르지 않습니다." />;
  }

  if (lobby.isPending) {
    return <LoadingState message="게임방에 입장하고 있어요." />;
  }

  if (lobby.roomError || !lobby.room) {
    return (
      <ErrorState
        message={getApiErrorMessage(
          lobby.roomError,
          "게임방 정보를 불러오지 못했습니다.",
        )}
        onRetry={() => void lobby.refetchRoom()}
      />
    );
  }

  const handleStart = async () => {
    try {
      await lobby.startGame();
      navigate(`/rooms/${roomId}/game`);
    } catch {
      // Mutation state is rendered by the room controls; stay in the room to retry.
    }
  };

  return (
    <RoomLobbyView
      room={lobby.room}
      currentPlayer={lobby.currentPlayer}
      canStart={lobby.canStart}
      isReadyUpdating={lobby.isReadyUpdating}
      isStarting={lobby.isStarting}
      onLeave={() => navigate("/")}
      onReadyChange={lobby.setReady}
      onStart={() => void handleStart()}
    />
  );
}
