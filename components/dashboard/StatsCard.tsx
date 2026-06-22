import { COLORS } from "@/constants/colors";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
}: StatsCardProps) {
  return (
    <div
      className="p-6 rounded-3xl border"
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm"
            style={{
              color: COLORS.muted,
            }}
          >
            {title}
          </p>

          <h2
            className="text-3xl font-bold mt-2"
            style={{
              color: COLORS.text,
            }}
          >
            {value}
          </h2>
        </div>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: COLORS.softCard,
          }}
        >
          <Icon
            size={24}
            color={COLORS.primary}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span
          className="text-sm font-semibold"
          style={{
            color: COLORS.primary,
          }}
        >
          {change}
        </span>

        <span
          className="text-sm"
          style={{
            color: COLORS.muted,
          }}
        >
          from last month
        </span>
      </div>
    </div>
  );
}