import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Card } from "@/common/card";
import { StatusBadge } from "@/common/StatusBadge";
import { COLORS } from "@/constants/colors";
import { getSchedules, Schedule } from "@/lib/schedulesApi";
import DataTable, { TableColumn } from "@/components/DataTable/DataTable";
import TableAvatar from "@/components/DataTable/TableAvatar";
import { ActionButtons } from "@/components/DataTable/ActionButtons";

export default async function SchedulesPage() {
  const schedules = await getSchedules();

  const columns: TableColumn<Schedule>[] = [
    {
      header: "Show",
      render: (schedule) => (
        <div className="flex items-center gap-4">
          <TableAvatar
            image={
              typeof schedule.show === "object"
                ? schedule.show?.coverImage
                : undefined
            }
            alt={
              typeof schedule.show === "object"
                ? schedule.show?.showName
                : "Unknown Show"
            }
            size={48}
          />

          <div>
            <h3
              className="font-semibold"
              style={{ color: COLORS.text }}
            >
              {typeof schedule.show === "object"
                ? schedule.show?.showName
                : "Unknown Show"}
            </h3>
          </div>
        </div>
      ),
    },

    {
      header: "Day / Time",
      render: (schedule) => (
        <div style={{ color: COLORS.text }}>
          <p className="font-medium">{schedule.day}</p>

          <p
            className="text-sm"
            style={{ color: COLORS.muted }}
          >
            {schedule.startTime} - {schedule.endTime}
          </p>
        </div>
      ),
    },

    {
      header: "Status",
      render: (schedule) => (
        <StatusBadge
          status={schedule.status || "draft"}
          size="sm"
        />
      ),
    },

    {
      header: "Actions",
      className: "text-right",
      render: (schedule) => (
        <ActionButtons
          viewUrl={`/schedules/${schedule._id}`}
          editUrl={`/schedules/${schedule._id}/edit`}
          deleteId={schedule._id}
          deleteType="schedule"
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
            Schedules
          </h1>

          <p
            className="mt-2"
            style={{ color: COLORS.muted }}
          >
            Manage show schedules and timing slots.
          </p>
        </div>

        <Link
          href="/schedules/create"
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold"
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.background,
          }}
        >
          <Plus size={18} />
          Add Schedule
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
          placeholder="Search schedules..."
          className="w-full bg-transparent outline-none"
          style={{ color: COLORS.text }}
        />
      </div>

      {/* Data Table */}
      <Card className="overflow-hidden p-0">
        <DataTable
          data={schedules}
          columns={columns}
          emptyMessage="No schedules found."
        />
      </Card>
    </main>
  );
}