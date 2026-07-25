import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Card } from "@/common/card";
import { StatusBadge } from "@/common/StatusBadge";
import { COLORS } from "@/constants/colors";

import { getShows, Show } from "@/lib/showApi";

import DataTable, {
  TableColumn,
} from "@/components/DataTable/DataTable";
import TableAvatar from "@/components/DataTable/TableAvatar";
import { ActionButtons } from "@/components/DataTable/ActionButtons";

export const dynamic = "force-dynamic";

export default async function ShowsPage() {
  const shows = await getShows();

  const columns: TableColumn<Show>[] = [
    {
      header: "Show",
      render: (show) => (
        <div className="flex items-center gap-4">
          <TableAvatar
            image={show.coverImage}
            alt={show.showName}
            size={48}
          />

          <div>
            <h3
              className="font-semibold"
              style={{ color: COLORS.text }}
            >
              {show.showName}
            </h3>

            <p
              className="text-sm"
              style={{ color: COLORS.muted }}
            >
              {show.genre || "N/A"}
            </p>
          </div>
        </div>
      ),
    },

    {
      header: "Station",
      render: (show) => (
        <span style={{ color: COLORS.text }}>
          {show.station}
        </span>
      ),
    },

    {
      header: "Live",
      render: (show) => (
        <span
          className="flex items-center gap-2 text-sm font-medium"
          style={{
            color: show.isLive
              ? "#22c55e"
              : COLORS.muted,
          }}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              show.isLive ? "animate-pulse" : ""
            }`}
            style={{
              backgroundColor: show.isLive
                ? "#22c55e"
                : COLORS.muted,
            }}
          />

          {show.isLive ? "Live" : "Offline"}
        </span>
      ),
    },

    {
      header: "Status",
      render: (show) => (
        <StatusBadge
          status={show.status}
          size="sm"
        />
      ),
    },

    {
      header: "Actions",
      className: "text-right",
      render: (show) => (
        <ActionButtons
          viewUrl={`/shows/${show._id}`}
          editUrl={`/shows/${show._id}/edit`}
          deleteId={show._id}
          deleteType="show"
        />
      ),
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className="text-4xl font-bold"
            style={{ color: COLORS.text }}
          >
            Shows
          </h1>

          <p
            className="mt-2"
            style={{ color: COLORS.muted }}
          >
            Manage radio shows and programs.
          </p>
        </div>

        <Link
          href="/shows/create"
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold"
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.background,
          }}
        >
          <Plus size={18} />
          Add Show
        </Link>
      </div>

      {/* Search */}
      <div
        className="mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3"
        style={{
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
        }}
      >
        <Search
          size={18}
          color={COLORS.muted}
        />

        <input
          type="text"
          placeholder="Search shows..."
          className="w-full bg-transparent outline-none"
          style={{ color: COLORS.text }}
        />
      </div>

      {/* Data Table */}
      <Card className="overflow-hidden p-0">
        <DataTable
          data={shows}
          columns={columns}
          emptyMessage="No shows found."
        />
      </Card>
    </main>
  );
}