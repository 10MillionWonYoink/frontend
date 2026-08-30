import { Camera, Clock3, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export default function RelayPage() {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-8">
        <header className="flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-neutral-900">
            PHOTO RELAY
          </Link>
          <span className="text-sm text-neutral-500">ROUND 01</span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-12">
          <p className="text-center text-sm font-medium text-neutral-500">
            지금 찍어야 하는 것
          </p>

          <h1 className="mt-4 text-center text-6xl font-bold tracking-tight text-neutral-950">
            강아지
          </h1>

          <div className="mx-auto mt-8 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
            <Clock3 className="size-4" />
            00:30
          </div>

          <label className="mt-10 flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-300 bg-white transition hover:border-neutral-500">
            <Camera className="size-10 text-neutral-400" />
            <span className="mt-4 font-semibold">사진을 선택하세요</span>
            <span className="mt-1 text-sm text-neutral-500">
              카메라로 촬영하거나 갤러리에서 선택
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
            />
          </label>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-4 font-semibold text-white">
              <Upload className="size-5" />
              사진 올리기
            </button>
            <Link
              to="/result"
              className="flex items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 py-4 font-semibold text-neutral-900"
            >
              결과 보기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}