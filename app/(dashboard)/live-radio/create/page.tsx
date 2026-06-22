"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { createLiveStream } from "@/lib/livestreameApi";
import ImageUploader from "@/common/ImageUploader";
import { SubmitButton } from "@/common/SubmitButton";
import { SectionTitle } from "@/common/SectionTitle";
import { Alert } from "@/common/Alert";
import { Card } from "@/common/card";
import { PageHeader } from "@/common/PageHeader";
import LiveStreamFormFields, { INITIAL_FORM, LiveStreamFormData, serializeForm } from "../LiveStreamFormFields";

export default function CreateLiveStreamPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState<LiveStreamFormData>(
      INITIAL_FORM
    );

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response =
        await createLiveStream(
          serializeForm(formData)
        );

      setSuccess(
        response.message ||
          "Live stream created successfully"
      );

      setFormData(INITIAL_FORM);

      setTimeout(() => {
        router.push(
          "/live-radio"
        );
      }, 1500);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title="Add Live Stream"
        subtitle="Create a new radio station or live stream."
        backHref="/live-radio"
      />

      <Alert
        type="error"
        message={error}
      />

      <Alert
        type="success"
        message={success}
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        <div className="xl:col-span-2">
          <Card>
            <LiveStreamFormFields
              formData={formData}
              onChange={handleChange}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <SectionTitle title="Preview" />

            <div
              className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
              style={{
                backgroundColor:
                  COLORS.softCard,
              }}
            >
              <ImageUploader
                value={
                  formData.logo ||
                  ""
                }
                onChange={(
                  url
                ) =>
                  setFormData(
                    (
                      prev
                    ) => ({
                      ...prev,
                      logo: url,
                    })
                  )
                }
              />
            </div>

            {formData.stationName && (
              <div className="mt-4 text-center">
                <p
                  className="text-lg font-bold"
                  style={{
                    color:
                      COLORS.text,
                  }}
                >
                  {
                    formData.stationName
                  }
                </p>

                <p
                  className="text-sm"
                  style={{
                    color:
                      COLORS.muted,
                  }}
                >
                  {
                    formData.frequency
                  }
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h2
              className="mb-2 text-xl font-bold"
              style={{
                color:
                  COLORS.text,
              }}
            >
              Ready to go live?
            </h2>

            <SubmitButton
              loading={loading}
              label="Create Stream"
              loadingLabel="Creating..."
              icon={
                <Save size={20} />
              }
              fullWidth
            />
          </Card>
        </div>
      </form>
    </main>
  );
}