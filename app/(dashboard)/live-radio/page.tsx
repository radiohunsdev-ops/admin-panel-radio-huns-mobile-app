import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Card } from "@/common/card";
import { StatusBadge } from "@/common/StatusBadge";
import { COLORS } from "@/constants/colors";

import {
  getLiveStreams,
  LiveStream,
} from "@/lib/livestreameApi";

import DataTable, {
  TableColumn,
} from "@/components/DataTable/DataTable";
import TableAvatar from "@/components/DataTable/TableAvatar";
import { ActionButtons } from "@/components/DataTable/ActionButtons";

export default async function LiveStreamsPage() {
  const streams = await getLiveStreams();

  const columns: TableColumn<LiveStream>[] = [
    {
      header: "Station",
      render: (stream) => (
        <div className="flex items-center gap-4">
          <TableAvatar
            image={stream.logo}
            alt={stream.stationName}
            size={48}
          />

          <div>
            <h3
              className="font-semibold"
              style={{ color: COLORS.text }}
            >
              {stream.stationName}
            </h3>

            <p
              className="text-sm uppercase tracking-wider"
              style={{ color: COLORS.muted }}
            >
              {stream.stationCode}
            </p>
          </div>
        </div>
      ),
    },

    {
      header: "Frequency",
      render: (stream) => (
        <span style={{ color: COLORS.text }}>
          {stream.frequency}
        </span>
      ),
    },

    {
      header: "Live",
      render: (stream) => (
        <span
          className="flex items-center gap-2 text-sm font-medium"
          style={{
            color: stream.isLive
              ? "#22c55e"
              : COLORS.muted,
          }}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              stream.isLive ? "animate-pulse" : ""
            }`}
            style={{
              backgroundColor: stream.isLive
                ? "#22c55e"
                : COLORS.muted,
            }}
          />

          {stream.isLive ? "Live" : "Offline"}
        </span>
      ),
    },

    {
      header: "Status",
      render: (stream) => (
        <StatusBadge
          status={stream.isActive ? "active" : "inactive"}
          size="sm"
        />
      ),
    },

    {
      header: "Actions",
      className: "text-right",
      render: (stream) => (
        <ActionButtons
          viewUrl={`/live-radio/${stream._id}`}
          editUrl={`/live-radio/${stream._id}/edit`}
          deleteId={stream._id}
          deleteType="livestream"
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
            Live Streams
          </h1>

          <p
            className="mt-2"
            style={{ color: COLORS.muted }}
          >
            Manage all radio stations and live streams.
          </p>
        </div>

        <Link
          href="/live-radio/create"
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold"
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.background,
          }}
        >
          <Plus size={18} />
          Add Stream
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
          placeholder="Search stations..."
          className="w-full bg-transparent outline-none"
          style={{ color: COLORS.text }}
        />
      </div>

      {/* Data Table */}
      <Card className="overflow-hidden p-0">
        <DataTable
          data={streams}
          columns={columns}
          emptyMessage="No live streams found."
        />
      </Card>
    </main>
  );
}