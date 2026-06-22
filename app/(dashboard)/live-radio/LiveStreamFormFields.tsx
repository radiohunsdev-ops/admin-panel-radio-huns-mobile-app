"use client";

import React from "react";
import { Radio, Image as ImageIcon, Info } from "lucide-react";

import { COLORS } from "@/constants/colors";
import { SectionTitle } from "@/common/SectionTitle";
import { FormField } from "@/common/FormField";

// =====================================================
// Types
// =====================================================

export interface LiveStreamFormData {
  stationName: string;
  stationCode: string;
  frequency: string;
  language: string;
  streamUrl: string;
  backupStreamUrl: string;
  coverImage: string;
  logo: string;
  genre: string;
  isActive: string;
}

// =====================================================
// Initial Form
// =====================================================

export const INITIAL_FORM: LiveStreamFormData = {
  stationName: "",
  stationCode: "",
  frequency: "",
  language: "English",
  streamUrl: "",
  backupStreamUrl: "",
  coverImage: "",
  logo: "",
  genre: "",
  isActive: "true",
};

// =====================================================
// Serialize Form
// =====================================================

export function serializeForm(form: LiveStreamFormData) {
  return {
    stationName: form.stationName,
    stationCode: form.stationCode,
    frequency: form.frequency,
    language: form.language,
    streamUrl: form.streamUrl,
    backupStreamUrl: form.backupStreamUrl,
    coverImage: form.coverImage,
    logo: form.logo,
    genre: form.genre,
    isActive: form.isActive === "true",
  };
}

// =====================================================
// Options
// =====================================================

const STATUS_OPTIONS = [
  {
    value: "true",
    label: "Active",
  },
  {
    value: "false",
    label: "Inactive",
  },
];

// =====================================================
// Types
// =====================================================

type ChangeHandler = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => void;

// =====================================================
// Props
// =====================================================

interface LiveStreamFormFieldsProps {
  formData: LiveStreamFormData;
  onChange: ChangeHandler;
}

// =====================================================
// Component
// =====================================================

export default function LiveStreamFormFields({
  formData,
  onChange,
}: LiveStreamFormFieldsProps) {
  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <section>
        <SectionTitle
          title="Basic Information"
          subtitle="Station identity and broadcast details."
          icon={<Radio size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Station Name"
            name="stationName"
            value={formData.stationName}
            onChange={onChange}
            required
            placeholder="Radio Huns FM"
          />

          <FormField
            label="Station Code"
            name="stationCode"
            value={formData.stationCode}
            onChange={onChange}
            required
            placeholder="RHFM"
          />

          <FormField
            label="Frequency"
            name="frequency"
            value={formData.frequency}
            onChange={onChange}
            required
            placeholder="107.6 FM"
          />

          <FormField
            label="Language"
            name="language"
            value={formData.language}
            onChange={onChange}
            placeholder="English"
          />

          <FormField
            as="select"
            label="Status"
            name="isActive"
            value={formData.isActive}
            onChange={onChange}
            options={STATUS_OPTIONS}
          />
        </div>
      </section>

      {/* Stream Configuration */}
      <section>
        <SectionTitle
          title="Stream Configuration"
          subtitle="Primary and backup stream URLs."
          icon={<Info size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 gap-5">
          <FormField
            label="Primary Stream URL"
            name="streamUrl"
            value={formData.streamUrl}
            onChange={onChange}
            required
            placeholder="https://stream.example.com/live"
          />

          <FormField
            label="Backup Stream URL"
            name="backupStreamUrl"
            value={formData.backupStreamUrl}
            onChange={onChange}
            placeholder="https://backup.example.com/live"
          />
        </div>
      </section>

      {/* Media */}
      <section>
        <SectionTitle
          title="Media"
          subtitle="Station branding and artwork."
          icon={<ImageIcon size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Cover Image URL"
            name="coverImage"
            value={formData.coverImage}
            onChange={onChange}
            placeholder="https://example.com/cover.jpg"
          />

          <FormField
            label="Logo URL"
            name="logo"
            value={formData.logo}
            onChange={onChange}
            placeholder="https://example.com/logo.png"
          />

          <FormField
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={onChange}
            placeholder="Pop, News, Sports"
          />
        </div>
      </section>
    </div>
  );
}