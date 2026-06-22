import { COLORS } from "@/constants/colors";

interface RecentShowCardProps {
  title: string;
  host: string;
  listeners: string;
  status: "Live" | "Scheduled" | "Ended";
}

export default function RecentShowCard({
  title,
  host,
  listeners,
  status,
}: RecentShowCardProps) {
  return (
    <div
      className="p-4 rounded-2xl border"
      style={{
        backgroundColor: COLORS.softCard,
        borderColor: COLORS.border,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3
            className="font-semibold"
            style={{
              color: COLORS.text,
            }}
          >
            {title}
          </h3>

          <p
            className="text-sm mt-1"
            style={{
              color: COLORS.muted,
            }}
          >
            Host: {host}
          </p>
        </div>

        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor:
              status === "Live"
                ? COLORS.primary
                : COLORS.card,
            color:
              status === "Live"
                ? COLORS.background
                : COLORS.text,
          }}
        >
          {status}
        </span>
      </div>

      <div
        className="mt-4 text-sm"
        style={{
          color: COLORS.muted,
        }}
      >
        👥 {listeners} listeners
      </div>
    </div>
  );
}