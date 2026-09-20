import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorState, LoadingState } from "../components/common/AsyncState";
import { ResultView } from "../components/result/ResultView";
import { roomQueryKeys, useRoom } from "../hooks/room/use-rooms";
import { useGameResult } from "../hooks/use-game-result";
import { useLobbySocket } from "../hooks/websocket/useLobbySocket";
import { getApiErrorMessage } from "../utils/get-api-error-message";
import { isValidRoomId } from "../utils/is-valid-room-id";

export function ResultContainer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { roomId = "" } = useParams();
  const roomQuery = useRoom(roomId);
  const resultQuery = useGameResult(roomId);
  const room = roomQuery.data;
  // "방 나가기"는 Backend의 기존 leaveRoom 흐름(lobby:leave)을 그대로 재사용한다.
  // 그 흐름은 WAITING 방에서만 허용되므로(대기 중인 방에서만 나갈 수 있다), 재게임
  // 정책상 정상 종료 후의 방(WAITING)에서만 소켓을 연결해 실제로 나가고, 이미
  // FINISHED된 방(이탈로 조기 종료된 경우)은 나갈 대상 자체가 없으므로 바로 홈으로
  // 이동한다.
  const canLeaveRoom = room?.status === "WAITING";
  const lobbySocket = useLobbySocket(Number(roomId), canLeaveRoom);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState<string>();
  if (!isValidRoomId(roomId))
    return <ErrorState message="게임 결과 주소가 올바르지 않습니다." />;
  if (roomQuery.isPending || resultQuery.isPending)
    return <LoadingState message="게임 결과를 확인하고 있어요." />;
  if (roomQuery.isError || !room)
    return (
      <ErrorState
        message={getApiErrorMessage(roomQuery.error, "방 정보를 불러오지 못했습니다.")}
        onRetry={() => void roomQuery.refetch()}
      />
    );
  if (resultQuery.error || !resultQuery.data)
    return (
      <ErrorState
        message={getApiErrorMessage(
          resultQuery.error,
          "아직 게임 결과를 볼 수 없습니다.",
        )}
        onRetry={() => void resultQuery.refetch()}
      />
    );
  const handleLeaveRoom = async () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setLeaveError(undefined);
    try {
      if (canLeaveRoom) await lobbySocket.leave();
      void queryClient.invalidateQueries({ queryKey: roomQueryKeys.all });
      navigate("/", { replace: true });
    } catch (error) {
      setLeaveError(getApiErrorMessage(error, "방을 나가지 못했습니다."));
      setIsLeaving(false);
    }
  };
  return (
    <ResultView
      room={room}
      result={resultQuery.data}
      onLeaveRoom={() => void handleLeaveRoom()}
      isLeavingRoom={isLeaving}
      leaveRoomError={leaveError}
    />
  );
}
