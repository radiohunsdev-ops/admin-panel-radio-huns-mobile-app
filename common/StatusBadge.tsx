import { COLORS } from "@/constants/colors";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}
 
export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const isActive = status === "active";
  const padding = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1 text-sm";
 
  return (
    <span
      className={`${padding} rounded-full font-semibold capitalize`}
      style={{
        backgroundColor: isActive ? COLORS.primary : COLORS.softCard,
        color: isActive ? COLORS.background : COLORS.text,
      }}
    >
      {status}
    </span>
  );
}