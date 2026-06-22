"use client";

import React, { useEffect, useState } from "react";
import { Radio, Image as ImageIcon, Info } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { SectionTitle } from "@/common/SectionTitle";
import { FormField } from "@/common/FormField";

export interface ShowFormData {
  showName: string;
  shortTitle: string;
  description: string;
  host: string;
  station: string;
  language: string;
  genre: string;
  tags: string;
  coverImage: string;
  isLive: string;
  isFeatured: string;
  showOnHome: string;
  allowSubscriptions: string;
  enableComments: string;
  status: "active" | "inactive" | "archived";
}

export const INITIAL_FORM: ShowFormData = {
  showName: "",
  shortTitle: "",
  description: "",
  host: "",
  station: "",
  language: "English",
  genre: "",
  tags: "",
  coverImage: "",
  isLive: "false",
  isFeatured: "false",
  showOnHome: "true",
  allowSubscriptions: "true",
  enableComments: "true",
  status: "active",
};

export function serializeForm(form: ShowFormData) {
  return {
    showName: form.showName,
    shortTitle: form.shortTitle,
    description: form.description,
    host: form.host,
    station: form.station,
    language: form.language,
    genre: form.genre,
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),

    coverImage: form.coverImage,

    isLive: form.isLive === "true",
    isFeatured: form.isFeatured === "true",
    showOnHome: form.showOnHome === "true",
    allowSubscriptions: form.allowSubscriptions === "true",
    enableComments: form.enableComments === "true",

    status: form.status,
  };
}

const BOOLEAN_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];

type ChangeHandler = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => void;

interface ShowFormFieldsProps {
  formData: ShowFormData;
  onChange: ChangeHandler;
}

export default function ShowFormFields({
  formData,
  onChange,
}: ShowFormFieldsProps) {
  const [hosts, setHosts] = useState<
    { _id: string; fullName: string }[]
  >([]);

  const [loadingHosts, setLoadingHosts] = useState(false);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        setLoadingHosts(true);

        const res = await fetch("/api/hosts");
        const json = await res.json();

        setHosts(json?.data || []);
      } catch (error) {
        console.error("Error fetching hosts:", error);
      } finally {
        setLoadingHosts(false);
      }
    };

    fetchHosts();
  }, []);

  return (
    <div className="space-y-8">

      {/* BASIC INFORMATION */}
      <section>
        <SectionTitle
          title="Basic Information"
          subtitle="Show identity and details."
          icon={<Radio size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Show Name"
            name="showName"
            value={formData.showName}
            onChange={onChange}
            required
          />

          <FormField
            label="Short Title"
            name="shortTitle"
            value={formData.shortTitle}
            onChange={onChange}
          />

          <FormField
            label="Station"
            name="station"
            value={formData.station}
            onChange={onChange}
            required
          />

          <FormField
            label="Language"
            name="language"
            value={formData.language}
            onChange={onChange}
          />

          <FormField
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={onChange}
          />

          {/* ✅ HOST DROPDOWN FROM API */}
          <FormField
            as="select"
            label="Host"
            name="host"
            value={formData.host}
            onChange={onChange}
            required
            options={[
              {
                value: "",
                label: loadingHosts ? "Loading hosts..." : "Select Host",
              },
              ...hosts.map((host) => ({
                value: host._id,
                label: host.fullName,
              })),
            ]}
          />
        </div>

        <div className="mt-5">
          <FormField
            as="textarea"
            label="Description"
            name="description"
            value={formData.description}
            onChange={onChange}
            required
          />
        </div>
      </section>

      {/* MEDIA */}
      <section>
        <SectionTitle
          title="Media"
          subtitle="Cover image and branding."
          icon={<ImageIcon size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Cover Image URL"
            name="coverImage"
            value={formData.coverImage}
            onChange={onChange}
          />

          <FormField
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={onChange}
          />
        </div>
      </section>

      {/* SETTINGS */}
      <section>
        <SectionTitle
          title="Settings"
          subtitle="Visibility and interaction options."
          icon={<Info size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            as="select"
            label="Live Show"
            name="isLive"
            value={formData.isLive}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Featured"
            name="isFeatured"
            value={formData.isFeatured}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Show On Home"
            name="showOnHome"
            value={formData.showOnHome}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Allow Subscriptions"
            name="allowSubscriptions"
            value={formData.allowSubscriptions}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Enable Comments"
            name="enableComments"
            value={formData.enableComments}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Status"
            name="status"
            value={formData.status}
            onChange={onChange}
            options={STATUS_OPTIONS}
          />
        </div>
      </section>
    </div>
  );
}