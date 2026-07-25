"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";

import ScheduleSidebar from "../../ScheduleSidebar";

import ScheduleFormFields, {
  INITIAL_SCHEDULE_FORM,
  ScheduleFormData,
} from "../../ScheduleFormFields";

import {
  getScheduleById,
  updateSchedule,
} from "@/lib/schedulesApi";

import {
  mapScheduleToForm,
  serializeScheduleForm,
} from "../../scheduleFormUtils";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditSchedulePage({
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
    useState<ScheduleFormData>(
      INITIAL_SCHEDULE_FORM,
    );

  useEffect(() => {
    async function loadSchedule() {
      try {
        const { id: scheduleId } =
          await params;

        setId(scheduleId);

        const schedule =
          await getScheduleById(
            scheduleId,
          );

        setFormData(
          mapScheduleToForm(
            schedule,
          ),
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load schedule",
        );
      } finally {
        setPageLoading(false);
      }
    }

    loadSchedule();
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
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

      const payload =
        serializeScheduleForm(
          formData,
        );

      const response =
        await updateSchedule(
          id,
          payload,
        );

      setSuccess(
        response.message ||
          "Schedule updated successfully",
      );

      setTimeout(() => {
        router.push(
          `/schedules/${id}`,
        );
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <EntityFormLayout
      pageLoading={pageLoading}
      title="Edit Schedule"
      subtitle="Update schedule information."
      backHref={`/schedules/${id}`}
      error={error}
      success={success}
      loading={loading}
      submitLabel="Save Changes"
      loadingLabel="Saving..."
      onSubmit={handleSubmit}
      form={
        <ScheduleFormFields
          formData={formData}
          onChange={handleChange}
        />
      }
      sidebar={
        <ScheduleSidebar
          formData={formData}
        />
      }
    />
  );
}