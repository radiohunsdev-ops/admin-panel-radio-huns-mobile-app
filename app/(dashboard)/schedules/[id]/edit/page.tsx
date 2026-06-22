"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { COLORS } from "@/constants/colors";

import { Alert } from "@/common/Alert";
import { SubmitButton } from "@/common/SubmitButton";
import { PageHeader } from "@/common/PageHeader";
import { Card } from "@/common/card";
import { PageLoader } from "@/common/PageLoader";
import ImageUploader from "@/common/ImageUploader";

import ScheduleFormFields, {
  INITIAL_SCHEDULE_FORM,
  ScheduleFormData,
} from "../../ScheduleFormFields";
import { getScheduleById, updateSchedule } from "@/lib/schedulesApi";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditSchedulePage({ params }: PageProps) {
  const router = useRouter();

  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] =
    useState<ScheduleFormData>(INITIAL_SCHEDULE_FORM);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const { id: scheduleId } = await params;

        setId(scheduleId);

        const schedule = await getScheduleById(scheduleId);

        setFormData({
          show: typeof schedule.show === "string"
            ? schedule.show
            : schedule.show?._id || "",




          mood: schedule.mood || "",

          day: schedule.day || "",
          customDays: schedule.customDays?.join(", ") || "",

          startTime: schedule.startTime || "",
          endTime: schedule.endTime || "",

          timezone: schedule.timezone || "America/Toronto",
          duration: schedule.duration?.toString() || "",


          send15MinAlert: String(schedule.send15MinAlert ?? true),
          send30MinAlert: String(schedule.send30MinAlert ?? false),
          sendStartNowAlert: String(schedule.sendStartNowAlert ?? true),

          enableSubscriptions: String(schedule.enableSubscriptions ?? true),

          linkedStream: schedule.linkedStream || "",
          backupStream: schedule.backupStream || "",

          status: schedule.status || "published",

          trackAnalytics: String(schedule.trackAnalytics ?? true),
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load schedule");
      } finally {
        setPageLoading(false);
      }
    }

    loadSchedule();
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        ...formData,



        customDays: formData.customDays
          ? formData.customDays.split(",").map((d) => d.trim()).filter(Boolean)
          : [],

        duration: formData.duration ? Number(formData.duration) : undefined,


        send15MinAlert: formData.send15MinAlert === "true",
        send30MinAlert: formData.send30MinAlert === "true",
        sendStartNowAlert: formData.sendStartNowAlert === "true",

        enableSubscriptions: formData.enableSubscriptions === "true",
        trackAnalytics: formData.trackAnalytics === "true",
      };

      const response = await updateSchedule(id, payload);

      setSuccess(response.message || "Schedule updated successfully");

      setTimeout(() => {
        router.push(`/schedules/${id}`);
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">

      <PageHeader
        title="Edit Schedule"
        subtitle="Update schedule information."
        backHref={`/schedules/${id}`}
      />

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >

        {/* LEFT */}
        <div className="xl:col-span-2">
          <Card>
            <ScheduleFormFields
              formData={formData}
              onChange={handleChange}
            />
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <Card>
            <h2
              className="mb-2 text-xl font-bold"
              style={{ color: COLORS.text }}
            >
              Save Changes
            </h2>

            <p
              className="mb-4 text-sm"
              style={{ color: COLORS.muted }}
            >
              Updates will reflect immediately in schedule system.
            </p>

            <SubmitButton
              loading={loading}
              label="Save Changes"
              loadingLabel="Saving..."
              icon={<Save size={18} />}
              fullWidth
            />
          </Card>

        </div>
      </form>
    </main>
  );
}