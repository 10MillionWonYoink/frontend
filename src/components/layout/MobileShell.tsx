import type { ReactNode } from "react";

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

export function MobileShell({ children, className = "" }: MobileShellProps) {
  return (
    <main className="min-h-dvh bg-[#f1eef9] sm:px-4 sm:py-6">
      {/* h-dvh(고정 높이) + overflow-y-auto여야 이 요소가 실제 스크롤 컨테이너가 된다.
          이전의 min-h-dvh는 콘텐츠에 맞춰 계속 커지기만 해서 실제 스크롤은 항상
          문서(html) 쪽에서 일어났고, 그 결과 이 요소를 기준으로 하는 자식의
          position:sticky가 전혀 동작하지 않았다(스크롤이 감지되는 대상이 서로
          달랐기 때문). overflow-x-hidden 하나만 있어도 브라우저가 overflow-y를
          자동으로 auto로 승격시키므로, 안 보이는 상태로 스크롤 컨테이너 역할을
          하고 있었다는 점이 원인이었다. */}
      <div
        className={`mx-auto flex h-dvh w-full max-w-[430px] flex-col overflow-y-auto overflow-x-hidden bg-[#fbfaff] sm:h-[calc(100dvh-3rem)] sm:rounded-[2rem] sm:shadow-[0_20px_70px_rgba(61,51,92,0.16)] ${className}`}
      >
        {children}
      </div>
    </main>
  );
}
