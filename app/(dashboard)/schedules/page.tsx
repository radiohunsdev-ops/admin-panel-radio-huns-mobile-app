/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Eye, Pencil, Plus, Radio, Search } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import DeleteButton from "@/common/DeleteButton";
import { IconButton } from "@/common/IconButton";
import { StatusBadge } from "@/common/StatusBadge";
import { getSchedules, Schedule } from "@/lib/schedulesApi";

export default async function SchedulesPage() {
  const schedules: Schedule[] = await getSchedules();

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: COLORS.text }}>
            Schedules
          </h1>

          <p className="mt-2" style={{ color: COLORS.muted }}>
            Manage show schedules and timing slots.
          </p>
        </div>

        <Link
          href="/schedules/create"
          className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.background,
          }}
        >
          <Plus size={18} />
          Add Schedule
        </Link>
      </div>

      {/* SEARCH */}
      <div
        className="mb-6 flex items-center gap-3 rounded-2xl border px-4 py-3"
        style={{
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
        }}
      >
        <Search size={18} color={COLORS.muted} />

        <input
          type="text"
          placeholder="Search schedules..."
          className="w-full bg-transparent outline-none"
          style={{ color: COLORS.text }}
        />
      </div>

      {/* TABLE CARD */}
      <Card className="overflow-hidden p-0">
        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead style={{ backgroundColor: COLORS.softCard }}>
              <tr>
                {["Show", "Day / Time", "Status", "Actions"].map((col) => (
                  <th
                    key={col}
                    className={`p-5 ${
                      col === "Actions" ? "text-right" : "text-left"
                    }`}
                    style={{ color: COLORS.muted }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <tr
                    key={schedule._id}
                    className="border-t"
                    style={{
                      borderColor: COLORS.border,
                    }}
                  >
                    {/* SHOW */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden"
                          style={{
                            backgroundColor: COLORS.softCard,
                          }}
                        >
                          <img
                            src={
                              typeof schedule.show === "string"
                                ? "/placeholder-image.png"
                                : schedule.show.coverImage ||
                                  "/placeholder-image.png"
                            }
                            alt=""
                          />
                        </div>

                        <div>
                          <h3
                            className="font-semibold"
                            style={{
                              color: COLORS.text,
                            }}
                          >
                            {typeof schedule.show === "object"
                              ? schedule.show?.showName
                              : "Unknown Show"}
                          </h3>
                        </div>
                      </div>
                    </td>

                    {/* DAY / TIME */}
                    <td className="p-5">
                      <div
                        style={{
                          color: COLORS.text,
                        }}
                      >
                        <p className="font-medium">{schedule.day}</p>

                        <p
                          className="text-sm"
                          style={{
                            color: COLORS.muted,
                          }}
                        >
                          {schedule.startTime} - {schedule.endTime}
                        </p>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-5">
                      <StatusBadge
                        status={schedule.status || "draft"}
                        size="sm"
                      />
                    </td>

                    {/* ACTIONS */}
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-3">
                        <IconButton
                          href={`/schedules/${schedule._id}`}
                          icon={<Eye size={18} color={COLORS.text} />}
                        />

                        <IconButton
                          href={`/schedules/${schedule._id}/edit`}
                          icon={<Pencil size={18} color={COLORS.primary} />}
                        />

                        <DeleteButton
                          id={schedule._id}
                          type="schedule"
                          title="Delete Schedule"
                          description="This action cannot be undone."
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center"
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    No schedules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="divide-y lg:hidden">
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <div key={schedule._id} className="p-5">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: COLORS.softCard,
                    }}
                  >
                    <Radio size={22} color={COLORS.primary} />
                  </div>

                  <div className="flex-1">
                    <h3
                      className="font-semibold"
                      style={{
                        color: COLORS.text,
                      }}
                    >
                      {typeof schedule.show === "object"
                        ? schedule.show?.showName
                        : "Unknown Show"}
                    </h3>

                    <p
                      className="text-sm"
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      {schedule.day} • {schedule.startTime} - {schedule.endTime}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <StatusBadge status={schedule.status || "draft"} size="sm" />
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <IconButton
                    href={`/schedules/${schedule._id}`}
                    icon={<Eye size={18} color={COLORS.text} />}
                  />

                  <IconButton
                    href={`/schedules/${schedule._id}/edit`}
                    icon={<Pencil size={18} color={COLORS.primary} />}
                  />

                  <DeleteButton
                    id={schedule._id}
                    type="schedule"
                    title="Delete Schedule"
                    description="This action cannot be undone."
                  />
                </div>
              </div>
            ))
          ) : (
            <div
              className="p-10 text-center"
              style={{
                color: COLORS.muted,
              }}
            >
              No schedules found.
            </div>
          )}
        </div>
      </Card>
    </main>
  );
}
