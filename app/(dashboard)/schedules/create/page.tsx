"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";

import ScheduleSidebar from "../ScheduleSidebar";

import ScheduleFormFields, {
  INITIAL_SCHEDULE_FORM,
  ScheduleFormData,
} from "../ScheduleFormFields";

import { createSchedule } from "@/lib/schedulesApi";
import { serializeScheduleForm } from "../scheduleFormUtils";

export default function CreateSchedulePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] =
    useState<ScheduleFormData>(
      INITIAL_SCHEDULE_FORM,
    );

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
        serializeScheduleForm(formData);

      const response =
        await createSchedule(payload);

      setSuccess(
        response.message ||
          "Schedule created successfully",
      );

      setFormData(
        INITIAL_SCHEDULE_FORM,
      );

      setTimeout(() => {
        router.push("/schedules");
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
      title="Add Schedule"
      subtitle="Create a new radio show schedule."
      backHref="/schedules"
      error={error}
      success={success}
      loading={loading}
      submitLabel="Create Schedule"
      loadingLabel="Creating..."
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