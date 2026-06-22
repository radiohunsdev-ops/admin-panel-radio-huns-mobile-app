/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  User,
} from "lucide-react";

import { COLORS } from "@/constants/colors";
import DeleteButton from "@/common/DeleteButton";
import { IconButton } from "@/common/IconButton";
import { StatusBadge } from "@/common/StatusBadge";

import {
  getHosts,
  Host,
} from "@/lib/hostApi";
import { Card } from "@/common/card";
export const dynamic = "force-dynamic";
export default async function HostsPage() {
  const hosts: Host[] = await getHosts();

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <h1
            className="text-4xl font-bold"
            style={{ color: COLORS.text }}
          >
            Hosts
          </h1>

          <p
            className="mt-2"
            style={{ color: COLORS.muted }}
          >
            Manage radio hosts and presenters.
          </p>
        </div>

        <Link
          href="/hosts/create"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.background,
          }}
        >
          <Plus size={18} />
          Add Host
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
          placeholder="Search hosts..."
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
                  "Host",
                  "City",
                  "Featured",
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
              {hosts.length > 0 ? (
                hosts.map((host) => (
                  <tr
                    key={host._id}
                    className="border-t"
                    style={{
                      borderColor: COLORS.border,
                    }}
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center"
                          style={{
                            backgroundColor:
                              COLORS.softCard,
                          }}
                        >
                          {host.profileImage ? (
                            <img
                              src={host.profileImage}
                              alt={host.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User
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
                            {host.fullName}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td
                      className="p-5"
                      style={{
                        color: COLORS.text,
                      }}
                    >
                      {host.city || "N/A"}
                    </td>

                    <td className="p-5">
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: host.isFeatured
                            ? "#22c55e"
                            : COLORS.muted,
                        }}
                      >
                        {host.isFeatured
                          ? "Featured"
                          : "Normal"}
                      </span>
                    </td>

                    <td className="p-5">
                      <StatusBadge
                        status={
                          host.isActive
                            ? "active"
                            : "inactive"
                        }
                        size="sm"
                      />
                    </td>

                    <td className="p-5">
                      <div className="flex items-center justify-end gap-3">
                        <IconButton
                          href={`/hosts/${host._id}`}
                          icon={
                            <Eye
                              size={18}
                              color={COLORS.text}
                            />
                          }
                        />

                        <IconButton
                          href={`/hosts/${host._id}/edit`}
                          icon={
                            <Pencil
                              size={18}
                              color={COLORS.primary}
                            />
                          }
                        />

                        <DeleteButton
                          id={host._id}
                          type="host"
                          title="Delete Host"
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
                    No hosts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y">
          {hosts.length > 0 ? (
            hosts.map((host) => (
              <div
                key={host._id}
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
                    {host.profileImage ? (
                      <img
                        src={host.profileImage}
                        alt={host.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
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
                      {host.fullName}
                    </h3>

                    <p
                      className="text-sm"
                      style={{
                        color: COLORS.muted,
                      }}
                    >
                      {host.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p style={{ color: COLORS.text }}>
                    <strong>City:</strong>{" "}
                    {host.city || "N/A"}
                  </p>

                  <p style={{ color: COLORS.text }}>
                    <strong>Phone:</strong>{" "}
                    {host.phone || "N/A"}
                  </p>

                  <p style={{ color: COLORS.text }}>
                    <strong>Languages:</strong>{" "}
                    {host.languages?.join(", ") ||
                      "N/A"}
                  </p>

                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={
                        host.isActive
                          ? "active"
                          : "inactive"
                      }
                      size="sm"
                    />

                    {host.isFeatured && (
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: "#22c55e",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <IconButton
                    href={`/hosts/${host._id}`}
                    icon={
                      <Eye
                        size={18}
                        color={COLORS.text}
                      />
                    }
                  />

                  <IconButton
                    href={`/hosts/${host._id}/edit`}
                    icon={
                      <Pencil
                        size={18}
                        color={COLORS.primary}
                      />
                    }
                  />

                  <DeleteButton
                    id={host._id}
                    type="host"
                    title="Delete Host"
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
              No hosts found.
            </div>
          )}
        </div>
      </Card>
    </main>
  );
}