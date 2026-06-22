"use client";

import React, { useEffect, useState } from "react";
import { Radio, Info } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { SectionTitle } from "@/common/SectionTitle";
import { FormField } from "@/common/FormField";

/* =========================
   TYPES
========================= */
export interface ScheduleFormData {
  show: string;

  mood: string;

  day: string;
  customDays: string;

  startTime: string;
  endTime: string;

  timezone: string;
  duration: string;

  send15MinAlert: string;
  send30MinAlert: string;
  sendStartNowAlert: string;

  enableSubscriptions: string;

  linkedStream: string;

  backupStream: string;

  status: "draft" | "published" | "scheduled" | "archived";

  trackAnalytics: string;
}

/* =========================
   INITIAL FORM
========================= */
export const INITIAL_SCHEDULE_FORM: ScheduleFormData = {
  show: "",
  mood: "",
  day: "Monday",
  customDays: "",

  startTime: "",
  endTime: "",

  timezone: "America/Toronto",
  duration: "",

  send15MinAlert: "true",
  send30MinAlert: "false",
  sendStartNowAlert: "true",

  enableSubscriptions: "true",

  linkedStream: "",

  backupStream: "",

  status: "published",

  trackAnalytics: "true",
};

/* =========================
   HELPERS
========================= */
const BOOLEAN_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type ChangeHandler = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => void;

/* =========================
   PROPS
========================= */
interface ScheduleFormFieldsProps {
  formData: ScheduleFormData;
  onChange: ChangeHandler;
}

export default function ScheduleFormFields({
  formData,
  onChange,
}: ScheduleFormFieldsProps) {
  const [shows, setShows] = useState<
    { _id: string; showName: string }[]
  >([]);

  const [loadingShows, setLoadingShows] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoadingShows(true);

        const res = await fetch("/api/shows");
        const json = await res.json();

        setShows(json?.data || []);
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoadingShows(false);
      }
    };

    fetchShows();
  }, []);

  return (
    <div className="space-y-8">
      {/* =========================
          BASIC INFO
      ========================= */}
      <section>
        <SectionTitle
          title="Schedule Information"
          subtitle="Link show and timing details."
          icon={<Radio size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            as="select"
            label="Show"
            name="show"
            value={formData.show}
            onChange={onChange}
            required
            options={[
              {
                value: "",
                label: loadingShows ? "Loading shows..." : "Select Show",
              },
              ...shows.map((s) => ({
                value: s._id,
                label: s.showName,
              })),
            ]}
          />

          <FormField
            as="select"
            label="Day"
            name="day"
            value={formData.day}
            onChange={onChange}
            options={DAYS.map((d) => ({
              value: d,
              label: d,
            }))}
          />

          <FormField
            label="Start Time"
            name="startTime"
            value={formData.startTime}
            onChange={onChange}
            type="time"
            required
          />

          <FormField
            label="End Time"
            name="endTime"
            value={formData.endTime}
            onChange={onChange}
            type="time"
            required
          />
        </div>
      </section>

      {/* =========================
          SETTINGS
      ========================= */}
      <section>
        <SectionTitle
          title="Settings"
          subtitle="Schedule behavior options."
          icon={<Info size={20} color={COLORS.primary} />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            as="select"
            label="Enable Subscriptions"
            name="enableSubscriptions"
            value={formData.enableSubscriptions}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Send 15 Min Alert"
            name="send15MinAlert"
            value={formData.send15MinAlert}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Send 30 Min Alert"
            name="send30MinAlert"
            value={formData.send30MinAlert}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Send Start Alert"
            name="sendStartNowAlert"
            value={formData.sendStartNowAlert}
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