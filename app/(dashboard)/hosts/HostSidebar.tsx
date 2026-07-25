"use client";

import Image from "next/image";
import { Save, User } from "lucide-react";

import { COLORS } from "@/constants/colors";

import { Card } from "@/common/card";
import { SubmitButton } from "@/common/SubmitButton";
import { SectionTitle } from "@/common/SectionTitle";
import ImageUploader from "@/common/ImageUploader";

import { HostFormData } from "./HostFormFields";

interface HostSidebarProps {
  formData: HostFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<HostFormData>
  >;

  loading: boolean;

  submitLabel: string;
  loadingLabel: string;

  buttonTitle: string;
  description?: string;
}

export default function HostSidebar({
  formData,
  setFormData,
  loading,
  submitLabel,
  loadingLabel,
  buttonTitle,
  description,
}: HostSidebarProps) {
  const safeProfileImage =
    typeof formData.profileImage === "string" &&
    formData.profileImage.startsWith("http")
      ? formData.profileImage
      : null;

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <Card>
        <SectionTitle title="Profile Preview" />

        <div className="grid grid-cols-2 gap-4">
          {/* Profile Image */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl p-4"
            style={{
              backgroundColor: COLORS.softCard,
            }}
          >
            <p className="mb-2 text-sm font-medium text-gray-600">
              Profile Image
            </p>

            <div className="w-full aspect-square overflow-hidden rounded-xl">
              <ImageUploader
                value={formData.profileImage}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    profileImage: url || "",
                  }))
                }
              />
            </div>
          </div>

          {/* Cover Image */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl p-4"
            style={{
              backgroundColor: COLORS.softCard,
            }}
          >
            <p className="mb-2 text-sm font-medium text-gray-600">
              Cover Image
            </p>

            <div className="w-full aspect-video overflow-hidden rounded-xl">
              <ImageUploader
                value={formData.coverImage}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: url || "",
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Avatar Preview */}
        <div className="mt-6 flex justify-center">
          {safeProfileImage ? (
            <Image
              src={safeProfileImage}
              alt="Host"
              width={120}
              height={120}
              className="rounded-full border object-cover"
            />
          ) : (
            <div
              className="flex h-28 w-28 items-center justify-center rounded-full"
              style={{
                backgroundColor: COLORS.softCard,
              }}
            >
              <User
                size={42}
                color={COLORS.primary}
              />
            </div>
          )}
        </div>

        {/* Host Info */}
        {(formData.fullName ||
          formData.email ||
          formData.city) && (
          <div className="mt-4 text-center">
            <p
              className="text-lg font-bold"
              style={{
                color: COLORS.text,
              }}
            >
              {formData.fullName ||
                "Host Name"}
            </p>

            <p
              className="text-sm"
              style={{
                color: COLORS.muted,
              }}
            >
              {formData.city ||
                "No City"}
            </p>

            <p
              className="text-sm"
              style={{
                color: COLORS.muted,
              }}
            >
              {formData.email ||
                "No Email"}
            </p>
          </div>
        )}
      </Card>

      {/* Submit Card */}
      <Card>
        <h2
          className="mb-2 text-xl font-bold"
          style={{
            color: COLORS.text,
          }}
        >
          {buttonTitle}
        </h2>
        {description && (
          <p className="mb-4 text-sm"  style={{  color: COLORS.muted }}
          >
            {description}
          </p>
        )}

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