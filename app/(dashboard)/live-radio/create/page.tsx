"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";
import LiveStreamSidebar from "@/app/(dashboard)/live-radio/LiveStreamSidebar";

import { createLiveStream } from "@/lib/livestreameApi";

import LiveStreamFormFields, {
  INITIAL_FORM,
  LiveStreamFormData,
  serializeForm,
} from "../LiveStreamFormFields";

export default function CreateLiveStreamPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] =
    useState<LiveStreamFormData>(INITIAL_FORM);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

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

      const payload = serializeForm(formData);

      const response = await createLiveStream(payload);

      setSuccess(
        response.message ||
          "Live stream created successfully"
      );

      setFormData(INITIAL_FORM);

      setTimeout(() => {
        router.push("/live-radio");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <EntityFormLayout
      title="Add Live Stream"
      subtitle="Create a new radio station or live stream."
      backHref="/live-radio"
      error={error}
      success={success}
      loading={loading}
      submitLabel="Create Stream"
      loadingLabel="Creating..."
      onSubmit={handleSubmit}
      form={
        <LiveStreamFormFields
          formData={formData}
          onChange={handleChange}
        />
      }
      sidebar={
        <LiveStreamSidebar
          formData={formData}
          setFormData={setFormData}
        />
      }
    />
  );
}