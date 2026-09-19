import { Check, Clipboard, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room, RoomPlayer } from "../../types/room";
import type { RoomUpdate } from "../../types/realtime";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { ChatPanel } from "../chat/ChatPanel";
import type { ChatMessage } from "../../types/chat";
import { PlayerGrid } from "./PlayerGrid";
import { RoomSettings } from "./RoomSettings";
import { RoomManageControls } from "./RoomManageControls";
import { useCopyToClipboard } from "../../hooks/use-copy-to-clipboard";

export interface RoomChatProps {
  messages: ChatMessage[];
  meUserId?: number;
  isLoadingHistory: boolean;
  onSend: (content: string) => Promise<unknown>;
  isSending: boolean;
  sendError?: string;
}

interface RoomLobbyViewProps {
  currentPlayer: RoomPlayer | undefined;
  isMutating: boolean;
  socketStatus: string;
  actionError: string | null;
  onReconnect: () => void;
  onLeave: () => void;
  onReadyChange: (isReady: boolean) => void;
  onUpdateRoom: (changes: Omit<RoomUpdate, "roomId">) => Promise<unknown>;
  onChangeHost: (userId: number) => Promise<unknown>;
  onStartGame: () => void;
  room: Room;
  chat: RoomChatProps;
}

export function RoomLobbyView({
  currentPlayer,
  isMutating,
  socketStatus,
  actionError,
  onReconnect,
  onLeave,
  onReadyChange,
  onUpdateRoom,
  onChangeHost,
  onStartGame,
  room,
  chat,
}: RoomLobbyViewProps) {
  const { isCopied, copyError, copy } = useCopyToClipboard(room.invitationCode);
  const canAct = socketStatus === "open" && room.status === "WAITING" && !isMutating;
  const everyoneElseReady = room.players
    .filter((player) => !player.isHost)
    .every((player) => player.isReady);

  const hasEnoughPlayers = room.players.length >= room.minPlayers;
  const canStartGame = canAct && hasEnoughPlayers && everyoneElseReady;

  return (
    <>
      <header className="bg-gradient-to-br from-[#6c4cff] to-[#b36bff] px-5 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onLeave}
            disabled={Boolean(currentPlayer && room.status === "WAITING" && !canAct)}
            className="min-h-10 rounded-xl bg-white/15 px-3 text-xs font-bold disabled:opacity-50"
          >
            {currentPlayer && room.status === "WAITING" ? "← 방 나가기" : "← 홈으로"}
          </button>
          <Link to="/" className="p-2 text-xs text-white/80">
            홈 보기
          </Link>
        </div>
        <h1 className="mt-4 break-words text-xl font-black tracking-[-0.02em]">
          {room.title}
        </h1>
        <p className="mt-1 text-xs text-white/75">
          방장 {room.hostName} · {room.currentPlayers} / {room.maxPlayers}명
        </p>
      </header>
      <div className="-mt-3 flex-1 space-y-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Card className="border-0 bg-gradient-to-br from-[#fff6d8] to-[#ffe4ed]">
          <p className="text-xs font-bold text-[#8b85a8]">초대 코드</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <strong
              className="whitespace-nowrap font-mono text-lg font-black text-[#6c4cff] sm:text-2xl"
              title={room.invitationCode}
              aria-label={room.invitationCode}
            >
              {room.invitationCode}
            </strong>
            <Button
              variant="ghost"
              onClick={() => void copy()}
              className="min-h-10 shrink-0 px-3 py-2"
            >
              {isCopied ? (
                <Check className="size-4" />
              ) : (
                <Clipboard className="size-4" />
              )}
            </Button>
          </div>
          {copyError && (
            <p role="alert" className="mt-2 break-all text-xs text-[#d93f75]">
              복사하지 못했어요. 코드: {room.invitationCode}
            </p>
          )}
        </Card>
        {currentPlayer && ["WAITING", "READY"].includes(room.status) && (
          <div
            className="flex items-center justify-between gap-2 text-xs text-[#8b85a8]"
            aria-live="polite"
          >
            <span>
              {socketStatus === "open"
                ? "대기실 실시간 연결됨"
                : "대기실 실시간 연결 확인 중"}
            </span>
            {["error", "closed"].includes(socketStatus) && (
              <button
                type="button"
                onClick={onReconnect}
                className="min-h-10 font-bold text-[#6c4cff]"
              >
                다시 연결
              </button>
            )}
          </div>
        )}
        {actionError && (
          <p role="alert" className="text-sm text-[#d93f75]">
            {actionError}
          </p>
        )}
        {!currentPlayer && (
          <p className="text-sm text-[#8b85a8]">
            참여 중인 방이 아닙니다. 홈 목록이나 초대 코드로 참여해주세요.
          </p>
        )}
        <PlayerGrid players={room.players} />
        <RoomSettings room={room} />
        {currentPlayer?.isHost && room.status === "WAITING" && (
          <RoomManageControls
            room={room}
            disabled={!canAct}
            isPending={isMutating}
            error={actionError}
            onUpdate={onUpdateRoom}
            onChangeHost={onChangeHost}
          />
        )}
        <ChatPanel title="방 채팅" {...chat} />
      </div>
      {/* 준비/게임 시작은 게임방에서 가장 중요한 액션이라, 채팅이 길어져도 항상
          손닿는 곳에 있도록 화면 하단에 고정한다(채팅 입력창은 위 ChatPanel 내부에
          그대로 남아있고, 여기서는 화면 전체 기준으로 fixed하지 않는다). */}
      <div className="sticky bottom-0 border-t border-[#eeeaf8] bg-[#fbfaff] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        {room.status === "FINISHED" ? (
          <Link
            to={`/rooms/${room.id}/result`}
            className="block rounded-2xl bg-[#eee9ff] p-4 text-center text-sm font-bold text-[#6c4cff]"
          >
            결과 화면 보기
          </Link>
        ) : currentPlayer?.isHost ? (
          <div>
            <Button
              fullWidth
              disabled={!canStartGame}
              onClick={onStartGame}
              className="min-h-14 gap-2"
            >
              <Rocket className="size-5" aria-hidden="true" />
              {isMutating ? "처리 중..." : "게임 시작하기"}
            </Button>
            {!hasEnoughPlayers ? (
              <p className="mt-2 text-center text-xs text-[#8b85a8]">
                최소 {room.minPlayers}명이 모이면 시작할 수 있어요.
              </p>
            ) : (
              !everyoneElseReady && (
                <p className="mt-2 text-center text-xs text-[#8b85a8]">
                  방장을 제외한 모든 참여자가 준비를 완료하면 시작할 수 있어요.
                </p>
              )
            )}
          </div>
        ) : (
          <Button
            fullWidth
            variant={currentPlayer?.isReady ? "ghost" : "secondary"}
            disabled={!currentPlayer || !canAct}
            onClick={() => onReadyChange(!currentPlayer?.isReady)}
            className="min-h-14"
          >
            {isMutating
              ? "처리 중..."
              : currentPlayer?.isReady
                ? "준비 취소"
                : "✓ 준비하기"}
          </Button>
        )}
      </div>
    </>
  );
}
