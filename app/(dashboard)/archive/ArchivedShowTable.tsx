
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil, Search, Trash2, Music2 } from "lucide-react";

import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import {
  ArchivedShow,
  deleteArchivedShow,
} from "@/lib/archiveApi";

interface ArchivedShowTableProps {
  episodes: ArchivedShow[];
  onDeleted: (id: string) => void;
}

function getShowName(episode: ArchivedShow): string {
  return typeof episode.show === "string"
    ? "Radio show"
    : episode.show.showName;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString();
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "—";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

export default function ArchivedShowTable({
  episodes,
  onDeleted,
}: ArchivedShowTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const filteredEpisodes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return episodes.filter((episode) => {
      const matchesSearch =
        episode.title.toLowerCase().includes(query) ||
        getShowName(episode).toLowerCase().includes(query) ||
        (episode.host ?? "").toLowerCase().includes(query);

      const matchesStatus =
        status === "all" || episode.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [episodes, search, status]);

  const handleDelete = async (episode: ArchivedShow) => {
    const confirmed = window.confirm(
      `Delete "${episode.title}" from the archive? This does not delete the stored audio file.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(episode._id);
      setError("");

      await deleteArchivedShow(episode._id);
      onDeleted(episode._id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete episode.",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <Card>
      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: COLORS.muted }}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search episodes, shows, or hosts..."
            className="w-full rounded-xl border px-10 py-3 outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border px-4 py-3"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 font-semibold">Episode</th>
              <th className="px-4 py-3 font-semibold">Show</th>
              <th className="px-4 py-3 font-semibold">Broadcast Date</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredEpisodes.map((episode) => (
              <tr key={episode._id} className="border-b last:border-0">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: COLORS.softCard }}
                    >
                      <Music2 size={20} color={COLORS.primary} />
                    </div>

                    <div>
                      <p className="font-medium">{episode.title}</p>
                      <p className="text-xs text-gray-500">
                        {episode.host || "No host"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">{getShowName(episode)}</td>

                <td className="px-4 py-4">
                  {formatDate(episode.broadcastDate)}
                </td>

                <td className="px-4 py-4">
                  {formatDuration(episode.durationSeconds)}
                </td>

                <td className="px-4 py-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize">
                    {episode.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/archive/${episode._id}/edit`}
                      aria-label={`Edit ${episode.title}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      type="button"
                      disabled={deletingId === episode._id}
                      onClick={() => void handleDelete(episode)}
                      aria-label={`Delete ${episode.title}`}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredEpisodes.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  No archived episodes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
