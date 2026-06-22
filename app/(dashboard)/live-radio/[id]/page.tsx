/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Edit,
  Globe,
  Radio,
  Wifi,
  Calendar,
  Tag,
  Languages,
} from "lucide-react";

import { COLORS } from "@/constants/colors";

import { PageHeader } from "@/common/PageHeader";
import { StatusBadge } from "@/common/StatusBadge";
import { SectionTitle } from "@/common/SectionTitle";
import { getLiveStreamById } from "@/lib/livestreameApi";
import { Card } from "@/common/card";
import { InfoTile } from "@/common/InfoTile";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LiveStreamDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const stream = await getLiveStreamById(id);

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <PageHeader
        title="Live Stream Details"
        subtitle="View complete station information."
        backHref="/live-radio"
        actions={
          <Link
            href={`/live-radio/${stream._id}/edit`}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.background,
            }}
          >
            <Edit size={18} />
            Edit Stream
          </Link>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Station Card */}
          <Card>
            <div className="flex flex-col md:flex-row gap-6">
              <div
                className="w-28 h-28 rounded-3xl overflow-hidden flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: COLORS.softCard,
                }}
              >
                {stream.logo ? (
                  <img
                    src={stream.logo}
                    alt={stream.stationName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Radio
                    size={48}
                    color={COLORS.primary}
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    className="text-3xl font-bold"
                    style={{
                      color: COLORS.text,
                    }}
                  >
                    {stream.stationName}
                  </h2>

                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                    style={{
                      backgroundColor:
                        COLORS.softCard,
                      color: COLORS.primary,
                    }}
                  >
                    {stream.stationCode}
                  </span>

                  <StatusBadge
                    status={
                      stream.isActive
                        ? "active"
                        : "inactive"
                    }
                  />
                </div>

                <p
                  className="mt-3"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  {stream.frequency}
                </p>
              </div>
            </div>
          </Card>

          {/* Stream URLs */}
          <Card>
            <SectionTitle
              title="Streaming Information"
              icon={
                <Wifi
                  size={20}
                  color={COLORS.primary}
                />
              }
            />

            <div className="space-y-4">
              <InfoTile
                icon={
                  <Globe
                    size={20}
                    color={COLORS.primary}
                  />
                }
                label="Primary Stream URL"
                value={stream.streamUrl}
              />

              {stream.backupStreamUrl && (
                <InfoTile
                  icon={
                    <Globe
                      size={20}
                      color={COLORS.muted}
                    />
                  }
                  label="Backup Stream URL"
                  value={stream.backupStreamUrl}
                />
              )}
            </div>
          </Card>

          {/* Cover Image */}
          {stream.coverImage && (
            <Card>
              <SectionTitle title="Cover Image" />

              <div className="overflow-hidden rounded-2xl">
                <img
                  src={stream.coverImage}
                  alt={stream.stationName}
                  className="w-full h-72 object-cover"
                />
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Station Information" />

            <div className="space-y-4">
              <InfoTile
                icon={
                  <Tag
                    size={20}
                    color={COLORS.primary}
                  />
                }
                label="Genre"
                value={stream.genre}
              />

              <InfoTile
                icon={
                  <Languages
                    size={20}
                    color={COLORS.primary}
                  />
                }
                label="Language"
                value={stream.language}
              />

              <InfoTile
                icon={
                  <Radio
                    size={20}
                    color={COLORS.primary}
                  />
                }
                label="Frequency"
                value={stream.frequency}
              />
            </div>
          </Card>

          <Card>
            <SectionTitle title="Dates" />

            <div className="space-y-4">
              <InfoTile
                icon={
                  <Calendar
                    size={20}
                    color={COLORS.primary}
                  />
                }
                label="Created At"
                value={new Date(
                  stream.createdAt
                ).toLocaleString()}
              />

              <InfoTile
                icon={
                  <Calendar
                    size={20}
                    color={COLORS.primary}
                  />
                }
                label="Updated At"
                value={new Date(
                  stream.updatedAt
                ).toLocaleString()}
              />
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}