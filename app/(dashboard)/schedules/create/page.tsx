"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { COLORS } from "@/constants/colors";

import { SubmitButton } from "@/common/SubmitButton";
import { SectionTitle } from "@/common/SectionTitle";
import { Alert } from "@/common/Alert";
import { Card } from "@/common/card";
import { PageHeader } from "@/common/PageHeader";

import ScheduleFormFields, {
  INITIAL_SCHEDULE_FORM,
  ScheduleFormData,
} from "../ScheduleFormFields";
import { createSchedule } from "@/lib/schedulesApi";

export default function CreateSchedulePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<ScheduleFormData>(
    INITIAL_SCHEDULE_FORM,
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        ...formData,

        description: "",
        station: "",

        customDays: formData.customDays
          ? formData.customDays
              .split(",")
              .map((d) => d.trim())
              .filter(Boolean)
          : [],

        duration: formData.duration ? Number(formData.duration) : undefined,

        send15MinAlert: formData.send15MinAlert === "true",
        send30MinAlert: formData.send30MinAlert === "true",
        sendStartNowAlert: formData.sendStartNowAlert === "true",

        enableSubscriptions: formData.enableSubscriptions === "true",

        trackAnalytics: formData.trackAnalytics === "true",
      };

      const response = await createSchedule(payload);

      setSuccess(response.message || "Schedule created successfully");

      setFormData(INITIAL_SCHEDULE_FORM);

      setTimeout(() => {
        router.push("/schedules");
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      {/* HEADER */}
      <PageHeader
        title="Add Schedule"
        subtitle="Create a new radio show schedule."
        backHref="/schedules"
      />

      {/* ALERTS */}
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        {/* LEFT SIDE */}
        <div className="xl:col-span-2">
          <Card>
            <ScheduleFormFields formData={formData} onChange={handleChange} />
          </Card>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* PREVIEW */}
          <Card>
            <SectionTitle title="Schedule Preview" />

            <div className="grid gap-4 md:grid-cols-2">
              {/* INFO PREVIEW */}
              <div
                className="flex items-center justify-center rounded-2xl px-4 py-6 text-center min-h-55"
                style={{ backgroundColor: COLORS.softCard }}
              >
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: COLORS.muted }}>
                    {formData.day} • {formData.startTime} - {formData.endTime}
                  </p>
                </div>
              </div>
            </div>
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
              label="Create Schedule"
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
