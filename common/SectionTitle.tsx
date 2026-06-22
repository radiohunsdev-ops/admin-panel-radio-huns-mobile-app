import { COLORS } from "@/constants/colors";
import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}
 
export function SectionTitle({ title, subtitle, icon }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon && (
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: COLORS.softCard }}
        >
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}