"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

import { COLORS } from "@/constants/colors";


import { Alert } from "@/common/Alert";
import { SubmitButton } from "@/common/SubmitButton";
import { PageHeader } from "@/common/PageHeader";
import ImageUploader from "@/common/ImageUploader";

import LiveStreamFormFields, {
  INITIAL_FORM,
  LiveStreamFormData,
  serializeForm,
} from "../../LiveStreamFormFields";
import { getLiveStreamById, updateLiveStream } from "@/lib/livestreameApi";
import { Card } from "@/common/card";
import { PageLoader } from "@/common/PageLoader";

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

          logo: stream.logo || "",

          genre: stream.genre || "",

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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
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
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <PageHeader
        title="Edit Stream"
        subtitle="Update live stream information."
        backHref={`/live-radio/${id}`}
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
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
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
            <h2
              className="text-xl font-bold mb-4"
              style={{
                color: COLORS.text,
              }}
            >
              Station Logo
            </h2>

            <div
              className="rounded-2xl overflow-hidden aspect-square flex items-center justify-center"
              style={{
                backgroundColor:
                  COLORS.softCard,
              }}
            >
              <ImageUploader
                value={
                  formData.logo || ""
                }
                onChange={(url) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      logo: url,
                    })
                  )
                }
              />
            </div>
          </Card>

          <Card>
            <h2
              className="text-xl font-bold mb-2"
              style={{
                color: COLORS.text,
              }}
            >
              Save Changes
            </h2>

            <p
              className="text-sm mb-4"
              style={{
                color: COLORS.muted,
              }}
            >
              Changes will be applied
              immediately to this
              radio station.
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