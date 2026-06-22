import { COLORS } from "@/constants/colors";
import Link from "next/link";
import { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  size?: "sm" | "md" | "lg";
}
 
const ICON_BTN_SIZES = {
  sm: "w-10 h-10 rounded-xl",
  md: "w-12 h-12 rounded-2xl",
  lg: "w-14 h-14 rounded-2xl",
};
 
export function IconButton({ icon, onClick, href, danger = false, size = "sm" }: IconButtonProps) {
  const cls = `${ICON_BTN_SIZES[size]} flex items-center justify-center transition-all duration-300 hover:scale-105`;
  const style = {
    backgroundColor: danger ? "transparent" : COLORS.softCard,
    border: danger ? `1px solid ${COLORS.border}` : undefined,
  };
 
  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {icon}
      </Link>
    );
  }
 
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {icon}
    </button>
  );
}