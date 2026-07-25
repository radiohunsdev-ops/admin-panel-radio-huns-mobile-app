"use client";

import { Dispatch, SetStateAction } from "react";
import { User } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { Card } from "@/common/card";
import { SectionTitle } from "@/common/SectionTitle";
import { UserFormData } from "./UserFromFields";

interface UserSidebarProps {
  formData: UserFormData;
  setFormData?: Dispatch<SetStateAction<UserFormData>>;
}

export default function UserSidebar({
  formData,
}: UserSidebarProps) {
  return (
    <Card>
      <SectionTitle title="User Preview" />

      <div
        className="flex min-h-64 items-center justify-center rounded-2xl px-6 py-8"
        style={{
          backgroundColor: COLORS.softCard,
        }}
      >
        <div className="w-full text-center">
          <div className="mb-4 flex justify-center">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: COLORS.background,
              }}
            >
              <User
                size={42}
                color={COLORS.primary}
              />
            </div>
          </div>

          <h3
            className="text-xl font-bold"
            style={{
              color: COLORS.text,
            }}
          >
            {formData.fullName || "User Name"}
          </h3>

          <p
            className="mt-1 text-sm"
            style={{
              color: COLORS.muted,
            }}
          >
            {formData.email || "user@example.com"}
          </p>

          <p
            className="mt-1 text-sm"
            style={{
              color: COLORS.muted,
            }}
          >
            {formData.phone || "No phone"}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <PreviewItem
              label="Role"
              value={formData.role}
            />

            <PreviewItem
              label="Provider"
              value={formData.provider}
            />

            <PreviewItem
              label="Verified"
              value={
                formData.emailVerified === "true"
                  ? "Yes"
                  : "No"
              }
            />

            <PreviewItem
              label="Language"
              value={
                formData.preferredLanguage ||
                "Not set"
              }
            />

            <PreviewItem
              label="City"
              value={
                formData.city || "N/A"
              }
            />

            <PreviewItem
              label="Region"
              value={
                formData.region || "N/A"
              }
            />
          </div>

          <div
            className="mt-6 rounded-xl p-4 text-left"
            style={{
              backgroundColor:
                COLORS.background,
            }}
          >
            <p
              className="mb-2 text-sm font-semibold"
              style={{
                color: COLORS.text,
              }}
            >
              Notification Preferences
            </p>

            <ul
              className="space-y-1 text-sm"
              style={{
                color: COLORS.muted,
              }}
            >
              <li>
                • 15 Min Reminder:{" "}
                {formData.showReminder15Min ===
                "true"
                  ? "On"
                  : "Off"}
              </li>

              <li>
                • 30 Min Reminder:{" "}
                {formData.showReminder30Min ===
                "true"
                  ? "On"
                  : "Off"}
              </li>

              <li>
                • Giveaway Alerts:{" "}
                {formData.giveawayAlerts ===
                "true"
                  ? "On"
                  : "Off"}
              </li>

              <li>
                • News Alerts:{" "}
                {formData.newsAlerts ===
                "true"
                  ? "On"
                  : "Off"}
              </li>
            </ul>
          </div>
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
        backgroundColor: COLORS.background,
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
        {value || "-"}
      </p>
    </div>
  );
}