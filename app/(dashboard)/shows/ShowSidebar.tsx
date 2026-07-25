"use client";

import { Dispatch, SetStateAction } from "react";

import { COLORS } from "@/constants/colors";

import { Card } from "@/common/card";
import { SectionTitle } from "@/common/SectionTitle";
import ImageUploader from "@/common/ImageUploader";

import { ShowFormData } from "./ShowFormFields";

interface ShowSidebarProps {
  formData: ShowFormData;
  setFormData: Dispatch<SetStateAction<ShowFormData>>;
}

export default function ShowSidebar({
  formData,
  setFormData,
}: ShowSidebarProps) {
  return (
    <Card>
      <SectionTitle title="Cover Preview" />

      <div
        className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
        style={{
          backgroundColor: COLORS.softCard,
        }}
      >
        <ImageUploader
          value={formData.coverImage || ""}
          onChange={(url) =>
            setFormData((prev) => ({
              ...prev,
              coverImage: url,
            }))
          }
        />
      </div>

      <div className="mt-6 text-center">
        <h3
          className="text-xl font-bold"
          style={{
            color: COLORS.text,
          }}
        >
          {formData.showName || "Show Name"}
        </h3>

        <p
          className="mt-1 text-sm"
          style={{
            color: COLORS.muted,
          }}
        >
          {formData.genre || "Genre"}
        </p>

        <p
          className="mt-1 text-sm"
          style={{
            color: COLORS.muted,
          }}
        >
          Host: {formData.host || "Select Host"}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <PreviewItem
            label="Status"
            value={formData.status || "active"}
          />

          <PreviewItem
            label="Language"
            value={formData.language || "English"}
          />

          <PreviewItem
            label="Live"
            value={formData.isLive === "true" ? "Yes" : "No"}
          />

          <PreviewItem
            label="Featured"
            value={formData.isFeatured === "true" ? "Yes" : "No"}
          />

          <PreviewItem
            label="Home"
            value={formData.showOnHome === "true" ? "Yes" : "No"}
          />

          <PreviewItem
            label="Comments"
            value={
              formData.enableComments === "true"
                ? "Enabled"
                : "Disabled"
            }
          />
        </div>
      </div>
    </Card>
  );
}

interface PreviewItemProps {
  label: string;
  value: string;
}

function PreviewItem({
  label,
  value,
}: PreviewItemProps) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{
        backgroundColor: COLORS.softCard,
      }}
    >
      <p
        className="text-xs"
        style={{
          color: COLORS.muted,
        }}
      >
        {label}
      </p>

      <p
        className="mt-1 text-sm font-semibold capitalize"
        style={{
          color: COLORS.text,
        }}
      >
        {value}
      </p>
    </div>
  );
}