import { COLORS } from "@/constants/colors";
import { ReactNode } from "react";

interface InfoTileProps {
  icon: ReactNode;
  label: string;
  value?: string | number | null | object;
}

export function InfoTile({ icon, label, value }: InfoTileProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: COLORS.softCard,
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        {icon}

        <span
          className="font-medium"
          style={{
            color: COLORS.text,
          }}
        >
          {label}
        </span>
      </div>

      <p style={{ color: COLORS.muted }}>
        {value == null
          ? "N/A"
          : typeof value === "object"
            ? JSON.stringify(value)
            : value}
      </p>
    </div>
  );
}
