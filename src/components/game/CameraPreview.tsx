import { Camera, ImagePlus } from "lucide-react";

interface CameraPreviewProps {
  imageUrl: string | null;
  isDisabled: boolean;
  onPhotoSelect: (photo: File) => void;
}

export function CameraPreview({
  imageUrl,
  isDisabled,
  onPhotoSelect,
}: CameraPreviewProps) {
  return (
    <label
      className={`relative flex min-h-64 w-full overflow-hidden rounded-[1.75rem] bg-[#21173b] ${
        isDisabled ? "cursor-default" : "cursor-pointer"
      }`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="제출할 사진 미리보기"
          className="size-full min-h-64 object-cover"
        />
      ) : (
        <span className="m-auto flex flex-col items-center text-white/65">
          <span className="grid size-16 place-items-center rounded-3xl bg-white/10">
            <Camera className="size-8" aria-hidden="true" />
          </span>
          <strong className="mt-4 text-sm text-white">사진을 촬영해주세요</strong>
          <span className="mt-1 text-xs">카메라 또는 앨범에서 선택</span>
        </span>
      )}
      {!isDisabled && (
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-[#6c4cff] shadow-lg">
          <ImagePlus className="size-4" aria-hidden="true" />
          {imageUrl ? "다시 선택" : "사진 선택"}
        </span>
      )}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        disabled={isDisabled}
        className="sr-only"
        onChange={(event) => {
          const photo = event.target.files?.[0];
          if (photo) {
            onPhotoSelect(photo);
          }
        }}
      />
    </label>
  );
}
