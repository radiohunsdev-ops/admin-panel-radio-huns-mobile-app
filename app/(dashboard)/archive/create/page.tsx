
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";

import {
  createArchivedShow,
  ArchivedShowPayload,
} from "@/lib/archiveApi";
import ArchivedShowFormFields, { ArchivedShowFormData, INITIAL_ARCHIVE_FORM } from "../ArchivedShowFormFields";
import ArchivedShowSidebar from "../ArchivedShowSidebar";

interface Choice {
  value: string;
  label: string;
}

interface NamedRecord {
  _id: string;
  showName?: string;
  title?: string;
  show?: { showName?: string } | string;
  startTime?: string;
  endTime?: string;
  day?: string;
}

function toOptions(records: NamedRecord[], type: "show" | "schedule"): Choice[] {
  return records.map((record) => ({
    value: record._id,
    label:
      type === "show"
        ? record.showName ?? record.title ?? record._id
        : `${typeof record.show === "object" ? record.show?.showName ?? "" : ""} ${record.day ?? ""} ${record.startTime ?? ""}${record.endTime ? `–${record.endTime}` : ""}`.trim() ||
          record.title ||
          record._id,
  }));
}

async function fetchChoices(
  url: string,
  type: "show" | "schedule",
): Promise<Choice[]> {
  const response = await fetch(url);
  const result: unknown = await response.json();

  if (!response.ok) {
    throw new Error(`Could not load ${type} options.`);
  }

  if (
    typeof result !== "object" ||
    result === null ||
    !("data" in result) ||
    !Array.isArray(result.data)
  ) {
    throw new Error(`Unexpected ${type} API response format.`);
  }

  return toOptions(result.data as NamedRecord[], type);
}

export default function CreateArchivedShowPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState<ArchivedShowFormData>(INITIAL_ARCHIVE_FORM);
  const [showOptions, setShowOptions] = useState<Choice[]>([]);
  const [scheduleOptions, setScheduleOptions] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      try {
        setLoadingOptions(true);

        const [shows, schedules] = await Promise.all([
          fetchChoices("/api/shows", "show"),
          fetchChoices("/api/schedules", "schedule"),
        ]);

        if (active) {
          setShowOptions(shows);
          setScheduleOptions(schedules);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load shows and schedules.",
          );
        }
      } finally {
        if (active) setLoadingOptions(false);
      }
    }

    void loadOptions();

    return () => {
      active = false;
    };
  }, []);

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
      setLoading(true);
      setError("");
      setSuccess("");

      const payload: ArchivedShowPayload = {
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

      await createArchivedShow(payload);

      setSuccess("Archived episode created successfully.");

      router.push("/archive");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create archived episode.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <EntityFormLayout
      title="Add Archived Show"
      subtitle="Add a recorded episode to the Radio Huns archive."
      backHref="/archive"
      error={
        loadingOptions
          ? "Loading shows and schedules..."
          : error
      }
      success={success}
      loading={loading || loadingOptions}
      submitLabel="Create Episode"
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
          loading={loading || loadingOptions}
          submitLabel="Create Episode"
          loadingLabel="Saving..."
          buttonTitle="Ready to save?"
          description="Review the recording details before creating this archive entry."
        />
      }
    />
  );
}
