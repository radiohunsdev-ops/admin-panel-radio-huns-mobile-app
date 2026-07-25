"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";
import LiveStreamSidebar from "@/app/(dashboard)/live-radio/LiveStreamSidebar";

import { PageLoader } from "@/common/PageLoader";

import {
  getLiveStreamById,
  updateLiveStream,
} from "@/lib/livestreameApi";

import LiveStreamFormFields, {
  INITIAL_FORM,
  LiveStreamFormData,
  serializeForm,
} from "../../LiveStreamFormFields";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditLiveStreamPage({
  params,
}: PageProps) {
  const router = useRouter();

  const [id, setId] = useState("");

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] =
    useState<LiveStreamFormData>(
      INITIAL_FORM
    );

  useEffect(() => {
    async function loadStream() {
      try {
        const { id: streamId } =
          await params;

        setId(streamId);

        const stream =
          await getLiveStreamById(
            streamId
          );

        setFormData({
          stationName:
            stream.stationName || "",

          stationCode:
            stream.stationCode || "",

          frequency:
            stream.frequency || "",

          language:
            stream.language || "English",

          streamUrl:
            stream.streamUrl || "",

          backupStreamUrl:
            stream.backupStreamUrl ||
            "",

          coverImage:
            stream.coverImage || "",

          logo:
            stream.logo || "",

          genre:
            stream.genre || "",

          isActive: String(
            stream.isActive ?? true
          ),
        });
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load stream"
        );
      } finally {
        setPageLoading(false);
      }
    }

    loadStream();
  }, [params]);

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

      const payload =
        serializeForm(formData);

      const response =
        await updateLiveStream(
          id,
          payload
        );

      setSuccess(
        response.message ||
          "Stream updated successfully"
      );

      setTimeout(() => {
        router.push(
          `/live-radio/${id}`
        );
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

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <EntityFormLayout
      title="Edit Stream"
      subtitle="Update live stream information."
      backHref={`/live-radio/${id}`}
      error={error}
      success={success}
      loading={loading}
      submitLabel="Save Changes"
      loadingLabel="Saving..."
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