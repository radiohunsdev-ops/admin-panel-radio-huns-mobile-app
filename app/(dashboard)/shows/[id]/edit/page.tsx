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

import ShowFormFields, {
  INITIAL_FORM,
  ShowFormData,
  serializeForm,
} from "../../ShowFormFields";

import { getShowById, updateShow } from "@/lib/showApi";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditShowPage({ params }: PageProps) {
  const router = useRouter();

  const [id, setId] = useState("");

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<ShowFormData>(INITIAL_FORM);

  useEffect(() => {
    async function loadShow() {
      try {
        const { id: showId } = await params;

        setId(showId);

        const show = await getShowById(showId);

        setFormData({
          showName: show.showName || "",

          shortTitle: show.shortTitle || "",

          description: show.description || "",

          host:
            typeof show.host === "string" ? show.host : show.host?._id || "",

          station: show.station || "",

          language: show.language || "English",

          genre: show.genre || "",

          tags: show.tags?.join(", ") || "",

          coverImage: show.coverImage || "",

          isLive: String(show.isLive ?? false),

          isFeatured: String(show.isFeatured ?? false),

          showOnHome: String(show.showOnHome ?? true),

          allowSubscriptions: String(show.allowSubscriptions ?? true),

          enableComments: String(show.enableComments ?? true),

          status: show.status || "active",
        });
      } catch (err) {
        console.error(err);

        setError(err instanceof Error ? err.message : "Failed to load show");
      } finally {
        setPageLoading(false);
      }
    }

    loadShow();
  }, [params]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = serializeForm(formData);

      const response = await updateShow(id, payload);

      setSuccess(response.message || "Show updated successfully");

      setTimeout(() => {
        router.push(`/shows/${id}`);
      }, 1500);
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
        title="Edit Show"
        subtitle="Update show information."
        backHref={`/shows/${id}`}
      />

      <Alert type="error" message={error} />

      <Alert type="success" message={success} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        <div className="xl:col-span-2">
          <Card>
            <ShowFormFields formData={formData} onChange={handleChange} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2
              className="mb-4 text-xl font-bold"
              style={{
                color: COLORS.text,
              }}
            >
              Cover Image
            </h2>

            <div
              className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
              style={{
                backgroundColor: COLORS.softCard,
              }}
            >
              <ImageUploader
                value={formData.coverImage}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: url,
                  }))
                }
              />
            </div>
          </Card>

          <Card>
            <h2
              className="mb-2 text-xl font-bold"
              style={{
                color: COLORS.text,
              }}
            >
              Save Changes
            </h2>

            <p
              className="mb-4 text-sm"
              style={{
                color: COLORS.muted,
              }}
            >
              Changes will be applied immediately to this show.
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
