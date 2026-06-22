"use client";

import { Loader2, Trash2, TriangleAlert, X } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { COLORS } from "@/constants/colors";

import { deleteLiveStream } from "@/lib/livestreameApi";
import { deleteHost } from "@/lib/hostApi";
import { deleteShow } from "@/lib/showApi";
import { deleteSchedule } from "@/lib/schedulesApi";
import { deleteUser } from "@/lib/userApi";

interface DeleteButtonProps {
  id: string;

  type: "livestream" | "host" | "show" | "schedule" | "user";
  title?: string;

  description?: string;
}

export default function DeleteButton({
  id,
  type,
  title = "Delete Item",
  description = "Are you sure you want to delete this item?",
}: DeleteButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      switch (type) {
        case "livestream":
          await deleteLiveStream(id);
          break;

        case "host":
          await deleteHost(id);
          break;

        case "show":
          await deleteShow(id);
          break;
        case "schedule":
          await deleteSchedule(id);
          break;
        case "user":
          await deleteUser(id);
          break;
        default:
          throw new Error(`Invalid delete type: ${type}`);
      }

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error("Delete Error:", error);

      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Delete Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          backgroundColor: COLORS.softCard,
        }}
      >
        <Trash2 size={18} color="#ef4444" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-md rounded-3xl border p-6"
            style={{
              backgroundColor: COLORS.card,
              borderColor: COLORS.border,
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: COLORS.softCard,
              }}
            >
              <X size={18} color={COLORS.text} />
            </button>

            {/* Icon */}
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10">
              <TriangleAlert size={38} color="#ef4444" />
            </div>

            {/* Title */}
            <h2
              className="text-center text-3xl font-bold"
              style={{
                color: COLORS.text,
              }}
            >
              {title}
            </h2>

            {/* Description */}
            <p
              className="mt-3 text-center leading-7"
              style={{
                color: COLORS.muted,
              }}
            >
              {description}
            </p>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 rounded-2xl py-4 font-semibold"
                style={{
                  backgroundColor: COLORS.softCard,
                  color: COLORS.text,
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-3 rounded-2xl py-4 font-semibold disabled:opacity-50"
                style={{
                  backgroundColor: "#ef4444",
                  color: "#fff",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
