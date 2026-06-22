"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { COLORS } from "@/constants/colors";
import { createShow } from "@/lib/showApi";

import ImageUploader from "@/common/ImageUploader";
import { SubmitButton } from "@/common/SubmitButton";
import { SectionTitle } from "@/common/SectionTitle";
import { Alert } from "@/common/Alert";
import { Card } from "@/common/card";
import { PageHeader } from "@/common/PageHeader";

import ShowFormFields, {
  INITIAL_FORM,
  ShowFormData,
  serializeForm,
} from "../ShowFormFields";

export default function CreateShowPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState<ShowFormData>(
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
        await createShow(
          serializeForm(formData)
        );

      setSuccess(
        response.message ||
          "Show created successfully"
      );

      setFormData(INITIAL_FORM);

      setTimeout(() => {
        router.push("/shows");
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
        title="Add Show"
        subtitle="Create a new radio show."
        backHref="/shows"
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
            <ShowFormFields
              formData={formData}
              onChange={handleChange}
            />
          </Card>
        </div>

        <div className="space-y-6">
          {/* Cover Image */}
          <Card>
            <SectionTitle title="Cover Preview" />

            <div
              className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
              style={{
                backgroundColor:
                  COLORS.softCard,
              }}
            >
              <ImageUploader
                value={
                  formData.coverImage ||
                  ""
                }
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: url,
                  }))
                }
              />
            </div>

            {formData.showName && (
              <div className="mt-4 text-center">
                <p
                  className="text-lg font-bold"
                  style={{
                    color:
                      COLORS.text,
                  }}
                >
                  {formData.showName}
                </p>

                <p
                  className="text-sm"
                  style={{
                    color:
                      COLORS.muted,
                  }}
                >
                  {formData.genre}
                </p>

                <p
                  className="text-sm"
                  style={{
                    color:
                      COLORS.muted,
                  }}
                >
                  Host: {formData.host}
                </p>
              </div>
            )}
          </Card>

          {/* Submit */}
          <Card>
            <h2
              className="mb-2 text-xl font-bold"
              style={{
                color:
                  COLORS.text,
              }}
            >
              Ready to publish?
            </h2>

            <SubmitButton
              loading={loading}
              label="Create Show"
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