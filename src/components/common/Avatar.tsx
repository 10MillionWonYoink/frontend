import { UserRound } from "lucide-react";

interface AvatarProps {
  imageUrl: string | null;
  nickname: string;
  size?: "small" | "medium" | "large";
}

const sizeClassNames = {
  small: "size-9",
  medium: "size-12",
  large: "size-16",
} as const;

export function Avatar({ imageUrl, nickname, size = "medium" }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#ebe5ff] text-[#6c4cff] shadow-sm ${sizeClassNames[size]}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${nickname} 프로필`}
          className="size-full object-cover"
        />
      ) : (
        <UserRound aria-label={`${nickname} 기본 프로필`} className="size-1/2" />
      )}
    </span>
  );
}
