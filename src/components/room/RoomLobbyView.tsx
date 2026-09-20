import { Check, ChevronLeft, Clipboard, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import type { Room, RoomPlayer } from "../../types/room";
import type { RoomUpdate } from "../../types/realtime";
import { Button } from "../common/Button";
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
      <header className="bg-gradient-to-br from-[#6c4cff] to-[#b36bff] px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
        <div className="flex items-center">
          <Link
            to="/"
            className="-ml-2 inline-flex min-h-10 items-center gap-1 rounded-xl px-2 text-xs font-bold text-white/90"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            이전
          </Link>
        </div>
        <h1 className="mt-2 break-words text-lg font-black tracking-[-0.02em]">
          {room.title}
        </h1>
        <p className="mt-0.5 text-xs text-white/75">
          방장 {room.hostName} · {room.currentPlayers} / {room.maxPlayers}명
        </p>
        {/* 초대 코드는 방 기본 정보와 같은 헤더 영역 안에 이어지도록 유지하되,
            보라색 배경 위 반투명 박스는 대비가 약해 코드가 잘 안 보였다 —
            기존에 쓰던 화이트→피치 그라데이션으로 이 영역만 색을 바꿔서
            눈에 띄게 한다. */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-[#fff6d8] to-[#ffe4ed] px-3.5 py-2.5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#8b85a8]">초대 코드</p>
            <strong
              className="block truncate font-mono text-sm font-black text-[#6c4cff]"
              title={room.invitationCode}
              aria-label={room.invitationCode}
            >
              {room.invitationCode}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => void copy()}
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/70"
          >
            {isCopied ? (
              <Check className="size-4 text-[#6c4cff]" aria-hidden="true" />
            ) : (
              <Clipboard className="size-4 text-[#6c4cff]" aria-hidden="true" />
            )}
          </button>
        </div>
        {copyError && (
          <p role="alert" className="mt-2 break-all text-xs text-white/90">
            복사하지 못했어요. 코드: {room.invitationCode}
          </p>
        )}
      </header>
      <div className="flex-1 space-y-4 px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
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
      {/* 준비/게임 시작/방 나가기는 게임방에서 가장 중요한 액션이라, 채팅이
          길어져도 항상 손닿는 곳에 있도록 화면 하단에 고정한다(채팅 입력창은 위
          ChatPanel 내부에 그대로 남아있고, 여기서는 화면 전체 기준으로 fixed하지
          않는다). 실수로 누르기 쉬웠던 상단 좌측 "방 나가기"는 준비하기/게임
          시작하기와 함께 여기로 옮기고, 준비하기 쪽을 시각적으로 더 강조한다. */}
      <div className="sticky bottom-0 border-t border-[#eeeaf8] bg-[#fbfaff] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        {room.status === "FINISHED" ? (
          <Link
            to={`/rooms/${room.id}/result`}
            className="block rounded-2xl bg-[#eee9ff] p-4 text-center text-sm font-bold text-[#6c4cff]"
          >
            결과 화면 보기
          </Link>
        ) : (
          <>
            {/* 준비/게임 시작(Primary)과 방 나가기(Secondary)를 한 줄에 50:50으로
                나란히 배치한다 — 나가기가 가능할 때만(대기 중인 방의 현재
                참여자) 2분할하고, 그 외에는 기존처럼 한 버튼이 전체 폭을 쓴다. */}
            <div
              className={
                currentPlayer && room.status === "WAITING"
                  ? "grid grid-cols-2 gap-3"
                  : ""
              }
            >
              {currentPlayer?.isHost ? (
                <Button
                  fullWidth
                  disabled={!canStartGame}
                  onClick={onStartGame}
                  className="min-h-14 gap-1 whitespace-nowrap px-2"
                >
                  <Rocket className="size-4 shrink-0" aria-hidden="true" />
                  {isMutating ? "처리 중..." : "게임 시작하기"}
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant={currentPlayer?.isReady ? "ghost" : "secondary"}
                  disabled={!currentPlayer || !canAct}
                  onClick={() => onReadyChange(!currentPlayer?.isReady)}
                  className={
                    currentPlayer?.isReady
                      ? "min-h-14 border-[#e0d6ff]! bg-[#eee9ff]! text-[#5638d1]! hover:bg-[#e2d9ff]!"
                      : "min-h-14"
                  }
                >
                  {isMutating
                    ? "처리 중..."
                    : currentPlayer?.isReady
                      ? "준비 취소"
                      : "✓ 준비하기"}
                </Button>
              )}
              {currentPlayer && room.status === "WAITING" && (
                <Button
                  fullWidth
                  variant="ghost"
                  disabled={!canAct}
                  onClick={onLeave}
                  className="min-h-14"
                >
                  방 나가기
                </Button>
              )}
            </div>
            {currentPlayer?.isHost &&
              (!hasEnoughPlayers ? (
                <p className="mt-2 text-center text-xs text-[#8b85a8]">
                  최소 {room.minPlayers}명이 모이면 시작할 수 있어요.
                </p>
              ) : (
                !everyoneElseReady && (
                  <p className="mt-2 text-center text-xs text-[#8b85a8]">
                    방장을 제외한 모든 참여자가 준비를 완료하면 시작할 수 있어요.
                  </p>
                )
              ))}
          </>
        )}
      </div>
    </>
  );
}
