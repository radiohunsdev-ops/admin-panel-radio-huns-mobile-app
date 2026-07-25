import Image from "next/image";
import { User } from "lucide-react";
import { COLORS } from "@/constants/colors";

interface TableAvatarProps {
  image?: string;
  alt: string;
  size?: number;
}

export default function TableAvatar({
  image,
  alt,
  size = 48,
}: TableAvatarProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: !image ? COLORS.softCard : undefined,
      }}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User size={size / 2} color={COLORS.primary} />
        </div>
      )}
    </div>
  );
}