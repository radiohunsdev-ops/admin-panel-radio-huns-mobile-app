/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Eye,
  Pencil,
  Plus,
  Radio,
  Search,
} from "lucide-react";
import { getLiveStreams, LiveStream } from "@/lib/livestreameApi";
import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import DeleteButton from "@/common/DeleteButton";
import { IconButton } from "@/common/IconButton";
import { StatusBadge } from "@/common/StatusBadge";


export default async function LiveStreamsPage() {
  const streams: LiveStream[] = await getLiveStreams();

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
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
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
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
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border mb-6"
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
          className="bg-transparent outline-none w-full"
          style={{ color: COLORS.text }}
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden p-0">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead
              style={{
                backgroundColor: COLORS.softCard,
              }}
            >
              <tr>
                {[
                  "Station",
                  "Frequency",
                  "Live",
                  "Status",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className={`p-5 ${
                      col === "Actions"
                        ? "text-right"
                        : "text-left"
                    }`}
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {streams.length > 0 ? (
                streams.map((stream) => (
                  <tr
                    key={stream._id}
                    className="border-t"
                    style={{
                      borderColor:
                        COLORS.border,
                    }}
                  >
                    {/* Station */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
                          style={{
                            backgroundColor:
                              COLORS.softCard,
                          }}
                        >
                          {stream.logo ? (
                            <img
                              src={stream.logo}
                              alt={
                                stream.stationName
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Radio
                              size={20}
                              color={
                                COLORS.primary
                              }
                            />
                          )}
                        </div>

                        <div>
                          <h3
                            className="font-semibold"
                            style={{
                              color:
                                COLORS.text,
                            }}
                          >
                            {
                              stream.stationName
                            }
                          </h3>

                          <p
                            className="text-sm uppercase tracking-wider"
                            style={{
                              color:
                                COLORS.muted,
                            }}
                          >
                            {
                              stream.stationCode
                            }
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Frequency */}
                    <td
                      className="p-5"
                      style={{
                        color: COLORS.text,
                      }}
                    >
                      {stream.frequency}
                    </td>

                    {/* Live Status */}
                    <td className="p-5">
                      <span
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{
                          color:
                            stream.isLive
                              ? "#22c55e"
                              : COLORS.muted,
                        }}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            stream.isLive
                              ? "animate-pulse"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              stream.isLive
                                ? "#22c55e"
                                : COLORS.muted,
                          }}
                        />

                        {stream.isLive
                          ? "Live"
                          : "Offline"}
                      </span>
                    </td>

                    {/* Active Status */}
                    <td className="p-5">
                      <StatusBadge
                        status={
                          stream.isActive
                            ? "active"
                            : "inactive"
                        }
                        size="sm"
                      />
                    </td>

                    {/* Actions */}
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-3">
                        <IconButton
                          href={`/live-radio/${stream._id}`}
                          icon={
                            <Eye
                              size={18}
                              color={
                                COLORS.text
                              }
                            />
                          }
                        />

                        <IconButton
                          href={`/live-radio/${stream._id}/edit`}
                          icon={
                            <Pencil
                              size={18}
                              color={
                                COLORS.primary
                              }
                            />
                          }
                        />

                        <DeleteButton
                          id={stream._id}
                          type="livestream"
                          title="Delete Live Stream"
                          description="This action cannot be undone."
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center"
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    No live streams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}