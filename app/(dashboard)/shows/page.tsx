/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Eye,
  Pencil,
  Plus,
  Radio,
  Search,
} from "lucide-react";


import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import DeleteButton from "@/common/DeleteButton";
import { IconButton } from "@/common/IconButton";
import { StatusBadge } from "@/common/StatusBadge";
import { getShows, Show } from "@/lib/showApi";

export default async function ShowsPage() {
  const shows: Show[] = await getShows();

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
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
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
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
          placeholder="Search shows..."
          className="bg-transparent outline-none w-full"
          style={{ color: COLORS.text }}
        />
      </div>

      {/* Desktop Table */}
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
                  "Show",
                  "Station",
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
              {shows.length > 0 ? (
                shows.map((show) => (
                  <tr
                    key={show._id}
                    className="border-t"
                    style={{
                      borderColor: COLORS.border,
                    }}
                  >
                    {/* Show */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
                          style={{
                            backgroundColor:
                              COLORS.softCard,
                          }}
                        >
                          {show.coverImage ? (
                            <img
                              src={show.coverImage}
                              alt={show.showName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Radio
                              size={20}
                              color={COLORS.primary}
                            />
                          )}
                        </div>

                        <div>
                          <h3
                            className="font-semibold"
                            style={{
                              color: COLORS.text,
                            }}
                          >
                            {show.showName}
                          </h3>

                          <p
                            className="text-sm"
                            style={{
                              color: COLORS.muted,
                            }}
                          >
                            {show.genre || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Station */}
                    <td
                      className="p-5"
                      style={{
                        color: COLORS.text,
                      }}
                    >
                      {show.station}
                    </td>

                  

                    {/* Live */}
                    <td className="p-5">
                      <span
                        className="flex items-center gap-2 text-sm font-medium"
                        style={{
                          color: show.isLive
                            ? "#22c55e"
                            : COLORS.muted,
                        }}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            show.isLive
                              ? "animate-pulse"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              show.isLive
                                ? "#22c55e"
                                : COLORS.muted,
                          }}
                        />

                        {show.isLive
                          ? "Live"
                          : "Offline"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-5">
                      <StatusBadge
                        status={show.status}
                        size="sm"
                      />
                    </td>

                    {/* Actions */}
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-3">
                        <IconButton
                          href={`/shows/${show._id}`}
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
                          href={`/shows/${show._id}/edit`}
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
                          id={show._id}
                          type="show"
                          title="Delete Show"
                          description="This action cannot be undone."
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center"
                    style={{
                      color: COLORS.muted,
                    }}
                  >
                    No shows found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y">
          {shows.length > 0 ? (
            shows.map((show) => (
              <div
                key={show._id}
                className="p-5"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center"
                    style={{
                      backgroundColor:
                        COLORS.softCard,
                    }}
                  >
                    {show.coverImage ? (
                      <img
                        src={show.coverImage}
                        alt={show.showName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Radio
                        size={22}
                        color={COLORS.primary}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3
                      className="font-semibold"
                      style={{
                        color: COLORS.text,
                      }}
                    >
                      {show.showName}
                    </h3>

                    <p
                      className="text-sm"
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      {show.station}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p
                    style={{
                      color: COLORS.text,
                    }}
                  >
                    <strong>Host:</strong>{" "}
                    {typeof show.host ===
                    "object"
                      ? show.host?.hostName
                      : show.host}
                  </p>

                  <p
                    style={{
                      color: COLORS.text,
                    }}
                  >
                    <strong>Genre:</strong>{" "}
                    {show.genre || "N/A"}
                  </p>

                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={show.status}
                      size="sm"
                    />

                    <span
                      className="text-sm"
                      style={{
                        color: show.isLive
                          ? "#22c55e"
                          : COLORS.muted,
                      }}
                    >
                      {show.isLive
                        ? "Live"
                        : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <IconButton
                    href={`/shows/${show._id}`}
                    icon={
                      <Eye
                        size={18}
                        color={COLORS.text}
                      />
                    }
                  />

                  <IconButton
                    href={`/shows/${show._id}/edit`}
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
                    id={show._id}
                    type="show"
                    title="Delete Show"
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
              No shows found.
            </div>
          )}
        </div>
      </Card>
    </main>
  );
}