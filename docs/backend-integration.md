# Frontend 연동 현황

확인일: 2026-09-13. Frontend `test` a129f87, Backend `test` 42ef6d5 기준.
Backend 소스는 수정하지 않는다. 현재 화면 스타일과 공통 MobileShell(최대 430px)을 유지한다.
Figma Make 참고 자료인 `migration/photo-relay-frontend-final-v1.zip`의 화면 구조와
현재 공통 컴포넌트를 유지했다. 원본 Figma URL/별도 화면정의서는 제공되지 않아
픽셀 단위 대조는 보류한다.

## 지금 연결한 기능

| 기능         | 실제 계약                                | Frontend 처리                                                                  |
| ------------ | ---------------------------------------- | ------------------------------------------------------------------------------ |
| 방 목록      | GET /api/rooms → RoomSummary[]           | 최신순 유지, 현재/최대 인원·상태, 60초 갱신·수동 새로고침                      |
| 내 방        | GET /api/rooms/my → 소문자 status        | 참여 중인 방 바로가기, 중복 입장 요청 방지                                     |
| 방 생성      | POST /api/rooms                          | title, maxParticipants, isPublic, timeLimitSeconds, relayCount; room.id로 이동 |
| 공개 방 참여 | POST /api/rooms/:roomId/join             | 실제 요청 후 이동. 현재 참여 중이면 요청 없이 이동                             |
| 코드 참여    | POST /api/rooms/invites/:inviteCode/join | 코드의 대소문자 보존, 생성된 16자리 코드 입력 허용                             |
| 상세 조회    | GET /api/rooms/:roomId                   | Backend가 반환하는 room, members, players 및 표시용 필드 사용                  |
| 초대 링크    | /rooms/join/:inviteCode (Frontend 경로)  | Backend가 생성하는 초대 URL의 참여 화면                                        |
| 인증         | /api/auth/me, signup, refresh, kakao     | 쿠키, registrationCompleted, 실제 signup 응답 필드 반영                        |

REST 근거: backend/src/project/rooms/rooms.controller.ts, rooms.service.ts, dto/create-room.dto.ts,
backend/src/project/auth/auth.controller.ts.

## 실시간 대기실

Backend `src/project/realtime/realtime.gateway.ts` 및 `handlers/lobby-realtime.handler.ts` 기준.
Socket.IO 4.x, `/realtime` 네임스페이스, 기본 전송 경로 `/socket.io`, transports `["websocket"]`.
인증은 HttpOnly `access_token` 쿠키. 임의 token/query/header를 추가하지 않는다.
인증 연결 실패 시 기존 `/api/auth/refresh`를 한 번 시도하고 재연결한다.
일반 재연결 시마다 `lobby:subscribe`를 다시 보내 구독을 복원한다.

| 보내는 이벤트     | payload                      | 수신/ack                                                                        |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------- |
| lobby:subscribe   | { roomId: number }           | lobby:state + { success, roomId }                                               |
| lobby:ready:set   | { roomId, isReady }          | lobby:ready-changed { roomId, userId, isReady } + success ack                   |
| lobby:room:update | { roomId, ...UpdateRoomDto } | lobby:room-updated + { success, room }                                          |
| lobby:host:change | { roomId, newHostUserId }    | lobby:host-changed + success/result ack                                         |
| lobby:leave       | { roomId }                   | lobby:member-left / lobby:host-changed / lobby:room-closed + success/result ack |

`exception`과 연결 해제·8초 응답 제한을 처리한다. 성공 여부가 불분명한 변경 요청을 자동 재전송하지 않는다.
준비/설정/방장/퇴장은 구독 완료 후만 가능하다. 페이지 이동 시 소켓 및 리스너를 정리한다.
REST 입장 후 member-joined broadcast가 없어 대기방 상세는 5초 간격으로 보완한다.
Socket.IO 옵션과 타입 참고: [Client options](https://socket.io/docs/v4/client-options/),
[TypeScript](https://socket.io/docs/v4/typescript/), [Acknowledgements](https://socket.io/docs/v4/emitting-events/).

## Backend 구현 대기 TODO

- [ ] **게임 시작 및 상태/복구 계약**: GamesService.startGame는 있지만 GamesController에 메서드/라우트가 없고 GameRealtimeHandler도 비어 있다. 기존 프론트의 POST /rooms/:id/start, GET /rooms/:id/game는 실제로 없다. 시작 버튼은 비활성화하고 존재하지 않는 요청을 제거했다.
- [ ] **카운트다운/턴 시작·변경**: beginFirstTurn는 내부 함수뿐이다. 예약 실행과 클라이언트 전달/재접속 상태 계약이 필요하다. 타이머를 임의로 시작하지 않는다. 서버 마감 시각을 받으면 그 시각을 기준으로 계산할 것.
- [ ] **사진 업로드·제출**: submitTurn(gameId, userId, imageKey)는 내부 함수. 파일 업로드, imageKey 발급, 이미지 열람 URL, 제출 엔드포인트/이벤트가 없다. 촬영/제출을 활성화하거나 가짜 URL을 저장하지 않는다.
- [ ] **게임 종료·결과**: 종료 broadcast, 결과 조회 Controller, 사진 목록/URL, 점수·순위·피드백 API가 없다. Game/Result 화면은 방 메타데이터만 조회하고 미제공 상태를 표시한다. Entity의 imageKey만으로 이미지를 표시하지 않는다.
- [ ] **채팅**: Controller/Gateway 이벤트/저장/조회 모두 없음. ChatPanel은 메시지/프로필을 받는 표시 컴포넌트이며 roomId에 의존하지 않는다. 송수신·가짜 메시지 저장은 하지 않는다. DM·그룹/방 대화의 식별 및 권한 계약 확정 후 연결한다.
- [ ] **입장 예외**: joinRoom은 탈퇴자를 포함해 인원을 count하고 기존 회원 unique 행을 재생성하므로 재참여/동시 중복 요청이 실패할 수 있다. 현재 참여자는 GET /rooms/my로 중복 요청을 피하지만 Backend의 원자적·멱등 처리 및 탈퇴자 제외가 필요하다.
- [ ] **입장 실시간 알림**: REST 입장 시 대기실 broadcast 없음. 현재 5초 상세 갱신으로 보완. 이벤트가 생기면 이 폴링을 줄인다.
- [ ] **게임 내부 턴 수 검증**: startGame는 totalTurns에 relayCount를 저장하지만 생성하는 turns는 참여 인원 × relayCount. 외부 연동을 열기 전 전체 턴 수와 종료 조건 확인이 필요하다.
- [ ] **배포 경로**: 프록시가 `/socket.io` 업그레이드를 Backend로 전달하는지 확인. VITE_WS_BASE_URL은 해당 Backend origin이며 네임스페이스는 클라이언트에서 고정한다.
- [ ] **디자인 대조**: Figma/화면정의서 링크를 받은 뒤 홈·결과·채팅·로그인 최종 간격/상태별 디자인을 대조한다.

이 문서의 TODO는 새 API 스펙을 제안하거나 구현된 것으로 간주하지 않는다.
기존 RankingCard, CameraPreview, Timer는 UI 재사용용으로 유지하며 미제공 응답 타입과 연결하지 않는다.

## 검증

- `pnpm lint`, `pnpm build` 통과.
- 임시 HTTP/Socket.IO 계약 서버와 headless Chrome으로 10개 브라우저 시나리오 검증: 320px 화면, 모달 및 Escape, 60초 자동 갱신과 수동 갱신, 방 참여/중복 입장 방지, 생성 DTO, 초대 코드·전체 코드 복사, 설정/방장 위임/퇴장, 준비 이벤트·예외·재연결, 미구현 게임/결과/채팅 요청 차단, 로그인·회원가입 최대 430px 폭.
- 실제 Backend DB/계정으로 게임을 끝까지 진행한 검증은 아니다. 외부에 노출되지 않은 게임/결과/채팅 기능은 검증 범위에서 제외했다.
- 결과 화면의 참여자는 상세 API의 현재 방 참여자이며, 과거 게임 참가 이력 또는 최종 순위가 아니다.
