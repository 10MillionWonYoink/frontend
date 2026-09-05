import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-neutral-500">404</p>
        <h1 className="mt-2 text-4xl font-bold">페이지를 찾을 수 없습니다.</h1>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-neutral-950 px-6 py-3 font-semibold text-white"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
