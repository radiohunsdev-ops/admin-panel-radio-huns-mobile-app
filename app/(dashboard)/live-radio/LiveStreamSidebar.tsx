"use client";

import { Dispatch, SetStateAction } from "react";

import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import ImageUploader from "@/common/ImageUploader";
import { SectionTitle } from "@/common/SectionTitle";
import { LiveStreamFormData } from "@/app/(dashboard)/live-radio/LiveStreamFormFields";


interface Props {
  formData: LiveStreamFormData;
  setFormData: Dispatch<SetStateAction<LiveStreamFormData>>;

  title?: string;
  description?: string;
}

export default function LiveStreamSidebar({
  formData,
  setFormData,
}: Props) {
  return (
    <Card>
      <SectionTitle title="Station Logo" />

      <div
        className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
        style={{
          backgroundColor: COLORS.softCard,
        }}
      >
        <ImageUploader
          value={formData.logo}
          onChange={(url) =>
            setFormData((prev) => ({
              ...prev,
              logo: url,
            }))
          }
        />
      </div>

      {formData.stationName && (
        <div className="mt-4 text-center">
          <p
            className="text-lg font-bold"
            style={{
              color: COLORS.text,
            }}
          >
            {formData.stationName}
          </p>

          <p
            className="text-sm"
            style={{
              color: COLORS.muted,
            }}
          >
            {formData.frequency}
          </p>
        </div>
      )}
    </Card>
  );
}