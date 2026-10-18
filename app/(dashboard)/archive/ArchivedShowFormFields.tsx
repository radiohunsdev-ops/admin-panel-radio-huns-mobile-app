
"use client";

import {
  Music2,
  AudioLines,
  CalendarDays,
  Settings,
} from "lucide-react";

import { COLORS } from "@/constants/colors";
import { SectionTitle } from "@/common/SectionTitle";
import { FormField } from "@/common/FormField";

export interface ArchivedShowFormData {
  show: string;
  schedule: string;
  title: string;
  description: string;
  host: string;
  broadcastDate: string;
  durationSeconds: string;
  audioUrl: string;
  storageKey: string;
  artworkUrl: string;
  status: "draft" | "published" | "archived";
}

export const INITIAL_ARCHIVE_FORM: ArchivedShowFormData = {
  show: "",
  schedule: "",
  title: "",
  description: "",
  host: "",
  broadcastDate: "",
  durationSeconds: "",
  audioUrl: "",
  storageKey: "",
  artworkUrl: "",
  status: "draft",
};

type ChangeHandler = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) => void;

interface Option {
  value: string;
  label: string;
}

interface ArchivedShowFormFieldsProps {
  formData: ArchivedShowFormData;
  onChange: ChangeHandler;
  showOptions: Option[];
  scheduleOptions: Option[];
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export default function ArchivedShowFormFields({
  formData,
  onChange,
  showOptions,
  scheduleOptions,
}: ArchivedShowFormFieldsProps) {
  return (
    <div className="space-y-8">
      <section>
        <SectionTitle
          title="Episode Information"
          subtitle="Enter the archived episode details."
          icon={<Music2 size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            as="select"
            label="Radio Show"
            name="show"
            value={formData.show}
            onChange={onChange}
            options={showOptions}
            required
          />

          <FormField
            as="select"
            label="Schedule"
            name="schedule"
            value={formData.schedule}
            onChange={onChange}
            options={scheduleOptions}
            required
          />

          <FormField
            label="Episode Title"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Punjabi Evening Show"
            required
          />

          <FormField
            label="Host Name"
            name="host"
            value={formData.host}
            onChange={onChange}
            placeholder="RJ Ankit"
          />
        </div>

        <div className="mt-5">
          <FormField
            as="textarea"
            label="Description"
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Describe this recorded episode..."
          />
        </div>
      </section>

      <section>
        <SectionTitle
          title="Recording Details"
          subtitle="Connect the episode to its audio recording."
          icon={<AudioLines size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            label="Audio URL"
            name="audioUrl"
            value={formData.audioUrl}
            onChange={onChange}
            placeholder="https://storage.example.com/episode.mp3"
            required
          />

          <FormField
            label="Storage Key"
            name="storageKey"
            value={formData.storageKey}
            onChange={onChange}
            placeholder="archives/episode.mp3"
          />

          <FormField
            label="Duration (seconds)"
            name="durationSeconds"
            value={formData.durationSeconds}
            onChange={onChange}
            placeholder="3600"
            required
          />

          <FormField
            label="Artwork URL"
            name="artworkUrl"
            value={formData.artworkUrl}
            onChange={onChange}
            placeholder="https://storage.example.com/artwork.jpg"
          />
        </div>
      </section>

      <section>
        <SectionTitle
          title="Broadcast Information"
          subtitle="When did this episode originally air?"
          icon={<CalendarDays size={20} color={COLORS.primary} />}
        />

        <FormField
          label="Broadcast Date and Time"
          name="broadcastDate"
          value={formData.broadcastDate}
          onChange={onChange}
          required
          type="datetime-local"
        />
      </section>

      <section>
        <SectionTitle
          title="Publishing Settings"
          subtitle="Control whether listeners can access the episode."
          icon={<Settings size={20} color={COLORS.primary} />}
        />

        <FormField
          as="select"
          label="Status"
          name="status"
          value={formData.status}
          onChange={onChange}
          options={STATUS_OPTIONS}
          required
        />
      </section>
    </div>
  );
}
