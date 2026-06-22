"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Save, User } from "lucide-react";

import { COLORS } from "@/constants/colors";
import { createHost } from "@/lib/hostApi";

import ImageUploader from "@/common/ImageUploader";
import { SubmitButton } from "@/common/SubmitButton";
import { SectionTitle } from "@/common/SectionTitle";
import { Alert } from "@/common/Alert";
import { PageHeader } from "@/common/PageHeader";

import HostFormFields, {
  INITIAL_FORM,
  HostFormData,
  serializeForm,
} from "../HostFormFields";

import { Card } from "@/common/card";

export default function CreateHostPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<HostFormData>(INITIAL_FORM);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await createHost(serializeForm(formData));

      setSuccess(response.message || "Host created successfully");

      setFormData(INITIAL_FORM);

      setTimeout(() => {
        router.push("/hosts");
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAFE IMAGE
  const safeProfileImage =
    typeof formData.profileImage === "string" &&
    formData.profileImage.startsWith("http")
      ? formData.profileImage
      : null;

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Add Host"
        subtitle="Create a new radio host."
        backHref="/hosts"
      />

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        {/* FORM */}
        <div className="xl:col-span-2">
          <Card>
            <HostFormFields formData={formData} onChange={handleChange} />
          </Card>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <Card>
            <SectionTitle title="Profile Preview" />

            <div className="grid grid-cols-2 gap-4">
              {/* PROFILE IMAGE UPLOADER */}
              <div
                className="flex flex-col items-center justify-center rounded-2xl p-4"
                style={{ backgroundColor: COLORS.softCard }}
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

              {/* COVER IMAGE UPLOADER */}
              <div
                className="flex flex-col items-center justify-center rounded-2xl p-4"
                style={{ backgroundColor: COLORS.softCard }}
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

            {/* PROFILE PREVIEW IMAGE */}
            <div className="mt-4 flex justify-center">
              {safeProfileImage ? (
                <Image
                  src={safeProfileImage}
                  alt="Host"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border"
                />
              ) : (
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS.softCard }}
                >
                  <User size={42} color={COLORS.primary} />
                </div>
              )}
            </div>

            {/* TEXT PREVIEW */}
            {formData.fullName && (
              <div className="mt-4 text-center">
                <p className="text-lg font-bold" style={{ color: COLORS.text }}>
                  {formData.fullName}
                </p>

                <p className="text-sm" style={{ color: COLORS.muted }}>
                  {formData.city || "No City"}
                </p>

                <p className="text-sm" style={{ color: COLORS.muted }}>
                  {formData.email || "No Email"}
                </p>
              </div>
            )}
          </Card>

          {/* SUBMIT */}
          <Card>
            <h2
              className="mb-2 text-xl font-bold"
              style={{ color: COLORS.text }}
            >
              Ready to publish?
            </h2>

            <SubmitButton
              loading={loading}
              label="Create Host"
              loadingLabel="Creating..."
              icon={<Save size={20} />}
              fullWidth
            />
          </Card>
        </div>
      </form>
    </main>
  );
}