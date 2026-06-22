import { COLORS } from "@/constants/colors";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}
 
export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border p-6 ${className}`}
      style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}
    >
      {children}
    </div>
  );
}