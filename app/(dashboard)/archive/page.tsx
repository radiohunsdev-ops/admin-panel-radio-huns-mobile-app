
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, RefreshCw, Archive } from "lucide-react";

import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import {
  ArchivedShow,
  getArchivedShows,
} from "@/lib/archiveApi";
import ArchivedShowTable from "./ArchivedShowTable";

export default function ArchivedShowsPage() {
  const [episodes, setEpisodes] = useState<ArchivedShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEpisodes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getArchivedShows();
      setEpisodes(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load archived shows.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEpisodes();
  }, [loadEpisodes]);

  const handleDeleted = (id: string) => {
    setEpisodes((current) =>
      current.filter((episode) => episode._id !== id),
    );
  };

  const publishedCount = episodes.filter(
    (episode) => episode.status === "published",
  ).length;

  const draftCount = episodes.filter(
    (episode) => episode.status === "draft",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1
            className="text-2xl font-bold md:text-3xl"
            style={{ color: COLORS.text }}
          >
            Archived Shows
          </h1>

          <p className="mt-2 text-sm" style={{ color: COLORS.muted }}>
            Manage recorded radio episodes and on-demand playback.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void loadEpisodes()}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border px-4 py-3 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            href="/archive/create"
            className="flex items-center gap-2 rounded-xl px-4 py-3 font-medium text-white"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Plus size={18} />
            Add Episode
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <Archive size={24} color={COLORS.primary} />
            <div>
              <p className="text-sm text-gray-500">Loaded Episodes</p>
              <p className="text-2xl font-bold">{episodes.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Published</p>
          <p className="mt-1 text-2xl font-bold">{publishedCount}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="mt-1 text-2xl font-bold">{draftCount}</p>
        </Card>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {loading ? (
        <Card>
          <p className="py-10 text-center text-gray-500">
            Loading archived episodes...
          </p>
        </Card>
      ) : (
        <ArchivedShowTable
          episodes={episodes}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
