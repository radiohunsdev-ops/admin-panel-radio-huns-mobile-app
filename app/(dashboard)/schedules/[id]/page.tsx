/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Edit,
  Radio,
  Calendar,
  Clock,
  MapPin,
  User,
  Bell,
  Activity,
} from "lucide-react";

import { COLORS } from "@/constants/colors";

import { PageHeader } from "@/common/PageHeader";
import { StatusBadge } from "@/common/StatusBadge";
import { SectionTitle } from "@/common/SectionTitle";
import { Card } from "@/common/card";
import { InfoTile } from "@/common/InfoTile";

import { getScheduleById } from "@/lib/schedulesApi";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ScheduleDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const schedule = await getScheduleById(id);

  // Safely handle populated / non-populated show
  const show =
    typeof schedule.show === "string"
      ? null
      : schedule.show;

  const showName = show?.showName || "N/A";

  const coverImage =
    show?.coverImage || "/placeholder-image.png";

  const hostName =
    typeof show?.host === "string"
      ? show.host
      : show?.host?.fullName || "N/A";

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* HEADER */}
      <PageHeader
        title="Schedule Details"
        subtitle="View complete schedule information."
        backHref="/schedules"
        actions={
          <Link
            href={`/schedules/${schedule._id}/edit`}
            className="flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.background,
            }}
          >
            <Edit size={18} />
            Edit Schedule
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* LEFT SIDE */}
        <div className="space-y-6 xl:col-span-2">
          {/* MAIN CARD */}
          <Card>
            <div className="flex flex-col gap-6 md:flex-row">
              <div
                className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl"
                style={{ backgroundColor: COLORS.softCard }}
              >
                <img
                  src={coverImage}
                  alt={showName}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    className="text-3xl font-bold"
                    style={{ color: COLORS.text }}
                  >
                    {showName}
                  </h2>

                  <StatusBadge
                    status={schedule.status || "published"}
                  />
                </div>

                {schedule.mood && (
                  <p
                    className="mt-3 text-sm"
                    style={{ color: COLORS.secondary }}
                  >
                    Mood: {schedule.mood}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* SHOW INFO */}
          <Card>
            <SectionTitle title="Show Information" />

            <div className="space-y-4">
              <InfoTile
                icon={<User size={20} color={COLORS.primary} />}
                label="Show Name"
                value={showName}
              />

              <InfoTile
                icon={<User size={20} color={COLORS.primary} />}
                label="Host"
                value={hostName}
              />
            </div>
          </Card>

          {/* TIMING */}
          <Card>
            <SectionTitle title="Schedule Timing" />

            <div className="space-y-4">
              <InfoTile
                icon={<Calendar size={20} color={COLORS.primary} />}
                label="Day"
                value={schedule.day || "N/A"}
              />

              {schedule.customDays &&
                schedule.customDays.length > 0 && (
                  <InfoTile
                    icon={
                      <Calendar
                        size={20}
                        color={COLORS.primary}
                      />
                    }
                    label="Custom Days"
                    value={schedule.customDays.join(", ")}
                  />
                )}

              <InfoTile
                icon={<Clock size={20} color={COLORS.primary} />}
                label="Time"
                value={`${schedule.startTime || "--:--"} - ${
                  schedule.endTime || "--:--"
                }`}
              />

              <InfoTile
                icon={<MapPin size={20} color={COLORS.primary} />}
                label="Timezone"
                value={schedule.timezone || "America/Toronto"}
              />

              <InfoTile
                icon={<Clock size={20} color={COLORS.primary} />}
                label="Duration"
                value={
                  schedule.duration
                    ? `${schedule.duration} mins`
                    : "N/A"
                }
              />
            </div>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* SETTINGS */}
          <Card>
            <SectionTitle title="Settings" />

            <div className="space-y-4">
              <InfoTile
                icon={<Bell size={20} color={COLORS.primary} />}
                label="15 Min Alert"
                value={
                  schedule.send15MinAlert
                    ? "Enabled"
                    : "Disabled"
                }
              />

              <InfoTile
                icon={<Bell size={20} color={COLORS.primary} />}
                label="30 Min Alert"
                value={
                  schedule.send30MinAlert
                    ? "Enabled"
                    : "Disabled"
                }
              />

              <InfoTile
                icon={<Bell size={20} color={COLORS.primary} />}
                label="Start Now Alert"
                value={
                  schedule.sendStartNowAlert
                    ? "Enabled"
                    : "Disabled"
                }
              />

              <InfoTile
                icon={<Bell size={20} color={COLORS.primary} />}
                label="Subscriptions"
                value={
                  schedule.enableSubscriptions
                    ? "Enabled"
                    : "Disabled"
                }
              />
            </div>
          </Card>

          {/* STREAM INFO */}
          <Card>
            <SectionTitle title="Stream Info" />

            <div className="space-y-4">
              <InfoTile
                icon={<Radio size={20} color={COLORS.primary} />}
                label="Linked Stream"
                value={schedule.linkedStream || "N/A"}
              />

              <InfoTile
                icon={<Radio size={20} color={COLORS.primary} />}
                label="Backup Stream"
                value={schedule.backupStream || "N/A"}
              />

              <InfoTile
                icon={<Activity size={20} color={COLORS.primary} />}
                label="Track Analytics"
                value={
                  schedule.trackAnalytics
                    ? "Enabled"
                    : "Disabled"
                }
              />
            </div>
          </Card>

          {/* DATES */}
          <Card>
            <SectionTitle title="Dates" />

            <div className="space-y-4">
              <InfoTile
                icon={<Calendar size={20} color={COLORS.primary} />}
                label="Created At"
                value={new Date(
                  schedule.createdAt
                ).toLocaleString()}
              />

              <InfoTile
                icon={<Calendar size={20} color={COLORS.primary} />}
                label="Updated At"
                value={new Date(
                  schedule.updatedAt
                ).toLocaleString()}
              />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}