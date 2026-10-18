
"use client";

import Image from "next/image";
import { AudioLines, Music2, Save } from "lucide-react";

import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import { SubmitButton } from "@/common/SubmitButton";
import { SectionTitle } from "@/common/SectionTitle";
import { ArchivedShowFormData } from "./ArchivedShowFormFields";

interface ArchivedShowSidebarProps {
  formData: ArchivedShowFormData;
  loading: boolean;
  submitLabel: string;
  loadingLabel: string;
  buttonTitle: string;
  description?: string;
}

export default function ArchivedShowSidebar({
  formData,
  loading,
  submitLabel,
  loadingLabel,
  buttonTitle,
  description,
}: ArchivedShowSidebarProps) {
  const artwork =
    formData.artworkUrl.trim().startsWith("https://") ||
    formData.artworkUrl.trim().startsWith("http://")
      ? formData.artworkUrl.trim()
      : "";

  const duration = Number(formData.durationSeconds);
  const durationLabel =
    Number.isFinite(duration) && duration > 0
      ? `${Math.floor(duration / 60)} min`
      : "Not set";

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle title="Episode Preview" />

        <div
          className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
          style={{ backgroundColor: COLORS.softCard }}
        >
          {artwork ? (
            <Image
              src={artwork}
              alt={formData.title || "Episode artwork"}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <Music2 size={56} color={COLORS.primary} />
          )}
        </div>

        <div className="mt-5 space-y-2">
          <h3
            className="text-lg font-bold"
            style={{ color: COLORS.text }}
          >
            {formData.title || "Episode title"}
          </h3>

          <p className="text-sm" style={{ color: COLORS.muted }}>
            {formData.host || "Host not set"}
          </p>

          <p className="text-sm" style={{ color: COLORS.muted }}>
            Duration: {durationLabel}
          </p>

          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
            {formData.status}
          </span>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <AudioLines size={24} color={COLORS.primary} />
          <div>
            <h2
              className="text-xl font-bold"
              style={{ color: COLORS.text }}
            >
              {buttonTitle}
            </h2>
            {description && (
              <p className="mt-1 text-sm" style={{ color: COLORS.muted }}>
                {description}
              </p>
            )}
          </div>
        </div>

        <SubmitButton
          loading={loading}
          label={submitLabel}
          loadingLabel={loadingLabel}
          icon={<Save size={18} />}
          fullWidth
        />
      </Card>
    </div>
  );
}
