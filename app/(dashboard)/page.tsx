import { Bell, Search } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { recentShows, stats } from "@/data/dashboard";
import RecentShowCard from "@/components/dashboard/RecentShowCard";
import StatsCard from "@/components/dashboard/StatsCard";

const CHART_BARS = [40, 70, 55, 90, 60, 110, 80];
const HIGHLIGHT_INDEX = 5;

const cardStyle = {
  backgroundColor: COLORS.card,
  borderColor: COLORS.border,
};

export default function DashboardPage() {
  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: COLORS.text }}>
            Dashboard
          </h1>
          <p className="mt-2" style={{ color: COLORS.muted }}>
            Welcome back 👋 Here’s what’s happening today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl border w-full lg:w-[320px]"
            style={cardStyle}
          >
            <Search size={18} color={COLORS.muted} />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none w-full"
              style={{ color: COLORS.text }}
            />
          </div>

          <button
            className="w-14 h-14 rounded-2xl flex items-center justify-center border"
            style={cardStyle}
            aria-label="Notifications"
          >
            <Bell size={20} color={COLORS.text} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ title, value, change, icon }) => (
          <StatsCard key={title} title={title} value={value} change={change} icon={icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="xl:col-span-2 rounded-3xl border p-6" style={cardStyle}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
                Analytics
              </h2>
              <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
                Weekly listeners growth
              </p>
            </div>

            <button
              className="px-4 py-2 rounded-xl text-sm"
              style={{ backgroundColor: COLORS.softCard, color: COLORS.text }}
            >
              This Week
            </button>
          </div>

          <div className="h-80 flex items-end gap-4">
            {CHART_BARS.map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-3xl transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${height}%`,
                  background: index === HIGHLIGHT_INDEX ? COLORS.primary : COLORS.secondary,
                }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border p-6" style={cardStyle}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: COLORS.text }}>
              Recent Shows
            </h2>
            <button className="text-sm" style={{ color: COLORS.primary }}>
              View All
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {recentShows?.map(({ title, host, listeners, status }) => (
              <RecentShowCard key={title} title={title} host={host} listeners={listeners} status={status} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}