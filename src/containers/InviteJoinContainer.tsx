import { Link, useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/layout/AppHeader";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useJoinByInviteCode } from "../hooks/room/use-rooms";
import { getApiErrorMessage } from "../utils/get-api-error-message";

export function InviteJoinContainer() {
  const { inviteCode = "" } = useParams();
  const mutation = useJoinByInviteCode();
  const navigate = useNavigate();
  return (
    <>
      <AppHeader />
      <div className="space-y-4 px-5 py-8">
        <h1 className="text-2xl font-black text-[#342953]">릴레이 초대가 도착했어요</h1>
        <Card>
          <p className="text-xs text-[#8b85a8]">초대 코드</p>
          <p className="mt-3 break-all font-mono text-lg font-bold text-[#6c4cff]">
            {inviteCode}
          </p>
        </Card>
        {mutation.error && (
          <p role="alert" className="text-sm text-[#d93f75]">
            {getApiErrorMessage(mutation.error, "초대 코드를 확인해주세요.")}
          </p>
        )}
        <Button
          fullWidth
          disabled={!inviteCode || inviteCode.length > 20 || mutation.isPending}
          onClick={() =>
            mutation.mutate(inviteCode, {
              onSuccess: ({ roomId }) =>
                navigate(`/rooms/${roomId}`, { replace: true }),
            })
          }
        >
          {mutation.isPending ? "입장 중..." : "초대받은 방 참여하기"}
        </Button>
        <Link to="/" className="block py-3 text-center text-sm text-[#8b85a8]">
          참여 중인 방 확인하기
        </Link>
      </div>
    </>
  );
}
