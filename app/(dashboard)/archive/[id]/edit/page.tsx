
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";

import {
  getArchivedShow,
  updateArchivedShow,
  ArchivedShowPayload,
} from "@/lib/archiveApi";
import ArchivedShowFormFields, { ArchivedShowFormData, INITIAL_ARCHIVE_FORM } from "../../ArchivedShowFormFields";
import { mapArchivedShowToForm } from "../../mapArchivedShowToForm";
import ArchivedShowSidebar from "../../ArchivedShowSidebar";

interface Choice {
  value: string;
  label: string;
}

interface NamedRecord {
  _id: string;
  showName?: string;
  title?: string;
  show?: { showName?: string } | string;
  day?: string;
  startTime?: string;
  endTime?: string;
}

async function fetchOptions(
  url: string,
  type: "show" | "schedule",
): Promise<Choice[]> {
  const response = await fetch(url);
  const result: unknown = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to load ${type} options.`);
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("data" in result) ||
    !Array.isArray(result.data)
  ) {
    throw new Error(`Unexpected ${type} response format.`);
  }

  return (result.data as NamedRecord[]).map((record) => ({
    value: record._id,
    label:
      type === "show"
        ? record.showName ?? record.title ?? record._id
        : [
            typeof record.show === "object"
              ? record.show?.showName
              : "",
            record.day,
            record.startTime && record.endTime
              ? `${record.startTime}–${record.endTime}`
              : record.startTime,
          ]
            .filter(Boolean)
            .join(" · ") || record.title || record._id,
  }));
}

export default function EditArchivedShowPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [formData, setFormData] =
    useState<ArchivedShowFormData>(INITIAL_ARCHIVE_FORM);
  const [showOptions, setShowOptions] = useState<Choice[]>([]);
  const [scheduleOptions, setScheduleOptions] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadEpisode = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [episode, shows, schedules] = await Promise.all([
        getArchivedShow(id),
        fetchOptions("/api/shows", "show"),
        fetchOptions("/api/schedules", "schedule"),
      ]);

      setFormData(mapArchivedShowToForm(episode));
      setShowOptions(shows);
      setScheduleOptions(schedules);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load archived episode.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadEpisode();
  }, [loadEpisode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: Partial<ArchivedShowPayload> = {
        show: formData.show,
        schedule: formData.schedule,
        title: formData.title.trim(),
        description: formData.description.trim(),
        host: formData.host.trim(),
        broadcastDate: new Date(formData.broadcastDate).toISOString(),
        durationSeconds: Number(formData.durationSeconds),
        audioUrl: formData.audioUrl.trim(),
        storageKey: formData.storageKey.trim(),
        artworkUrl: formData.artworkUrl.trim(),
        status: formData.status,
      };

      await updateArchivedShow(id, payload);

      setSuccess("Archived episode updated successfully.");
      router.push("/archive");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update archived episode.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading archived episode...
      </div>
    );
  }

  return (
    <EntityFormLayout
      title="Edit Archived Show"
      subtitle="Update recording information and publishing settings."
      backHref="/archive"
      error={error}
      success={success}
      loading={saving}
      submitLabel="Save Changes"
      loadingLabel="Saving..."
      onSubmit={handleSubmit}
      form={
        <ArchivedShowFormFields
          formData={formData}
          onChange={handleChange}
          showOptions={showOptions}
          scheduleOptions={scheduleOptions}
        />
      }
      sidebar={
        <ArchivedShowSidebar
          formData={formData}
          loading={saving}
          submitLabel="Save Changes"
          loadingLabel="Saving..."
          buttonTitle="Update episode"
          description="Changes will be reflected in the archive."
        />
      }
    />
  );
}
