"use client";

import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import { SectionTitle } from "@/common/SectionTitle";
import { ScheduleFormData } from "./ScheduleFormFields";

interface ScheduleSidebarProps {
  formData: ScheduleFormData;
}

export default function ScheduleSidebar({
  formData,
}: ScheduleSidebarProps) {
  const day =
    formData.day === "custom"
      ? formData.customDays || "Custom Days"
      : formData.day || "Day";

  const duration = formData.duration
    ? `${formData.duration} min`
    : "--";

  return (
    <Card>
      <SectionTitle title="Schedule Preview" />

      <div
        className="flex min-h-56 flex-col items-center justify-center rounded-2xl p-6 text-center"
        style={{
          backgroundColor: COLORS.softCard,
        }}
      >
        <h3
          className="text-xl font-bold"
          style={{
            color: COLORS.text,
          }}
        >
          {formData.show || "Select Show"}
        </h3>

        <p
          className="mt-2 text-sm"
          style={{
            color: COLORS.muted,
          }}
        >
          {day}
        </p>

        <p
          className="mt-1 text-lg font-semibold"
          style={{
            color: COLORS.primary,
          }}
        >
          {formData.startTime || "--:--"} -{" "}
          {formData.endTime || "--:--"}
        </p>

        <div className="mt-6 grid w-full grid-cols-2 gap-4">
          <div
            className="rounded-xl p-3"
            style={{
              backgroundColor: "#ffffff",
            }}
          >
            <p
              className="text-xs"
              style={{
                color: COLORS.muted,
              }}
            >
              Duration
            </p>

            <p
              className="font-semibold"
              style={{
                color: COLORS.text,
              }}
            >
              {duration}
            </p>
          </div>

          <div
            className="rounded-xl p-3"
            style={{
              backgroundColor: "#ffffff",
            }}
          >
            <p
              className="text-xs"
              style={{
                color: COLORS.muted,
              }}
            >
              Status
            </p>

            <p
              className="font-semibold capitalize"
              style={{
                color: COLORS.text,
              }}
            >
              {formData.status || "Published"}
            </p>
          </div>
        </div>

        <div className="mt-6 w-full space-y-2 text-left">
          <PreviewItem
            label="15 Min Alert"
            value={formData.send15MinAlert === "true"}
          />

          <PreviewItem
            label="30 Min Alert"
            value={formData.send30MinAlert === "true"}
          />

          <PreviewItem
            label="Start Now Alert"
            value={formData.sendStartNowAlert === "true"}
          />

          <PreviewItem
            label="Subscriptions"
            value={formData.enableSubscriptions === "true"}
          />

          <PreviewItem
            label="Analytics"
            value={formData.trackAnalytics === "true"}
          />
        </div>
      </div>
    </Card>
  );
}

interface PreviewItemProps {
  label: string;
  value: boolean;
}

function PreviewItem({
  label,
  value,
}: PreviewItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="text-sm"
        style={{
          color: COLORS.muted,
        }}
      >
        {label}
      </span>

      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          value
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {value ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}