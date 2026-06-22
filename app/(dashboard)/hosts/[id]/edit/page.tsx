"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Save, User } from "lucide-react";

import { COLORS } from "@/constants/colors";

import { Alert } from "@/common/Alert";
import { SubmitButton } from "@/common/SubmitButton";
import { PageHeader } from "@/common/PageHeader";
import { PageLoader } from "@/common/PageLoader";
import ImageUploader from "@/common/ImageUploader";

import HostFormFields, {
  INITIAL_FORM,
  HostFormData,
  serializeForm,
} from "../../HostFormFields";

import { getHostById, updateHost } from "@/lib/hostApi";
import { Card } from "@/common/card";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditHostPage({ params }: PageProps) {
  const router = useRouter();

  const [id, setId] = useState("");

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<HostFormData>(INITIAL_FORM);

  useEffect(() => {
    async function loadHost() {
      try {
        const { id: hostId } = await params;

        setId(hostId);

        const host = await getHostById(hostId);

        setFormData({
          fullName: host.fullName || "",

          bio: host.bio || "",

          profileImage: host.profileImage || "",

          coverImage: host.coverImage || "",

          email: host.email || "",

          phone: host.phone || "",

          city: host.city || "",

          languages: host.languages?.join(", ") || "",

          specialties: host.specialties?.join(", ") || "",

          instagram: host.socialLinks?.instagram || "",

          facebook: host.socialLinks?.facebook || "",

          twitter: host.socialLinks?.twitter || "",

          youtube: host.socialLinks?.youtube || "",

          website: host.socialLinks?.website || "",

          isFeatured: String(host.isFeatured ?? false),

          isActive: String(host.isActive ?? true),
        });
      } catch (err) {
        console.error(err);

        setError(err instanceof Error ? err.message : "Failed to load host");
      } finally {
        setPageLoading(false);
      }
    }

    loadHost();
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

      const response = await updateHost(id, payload);

      setSuccess(response.message || "Host updated successfully");

      setTimeout(() => {
        router.push(`/hosts/${id}`);
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
        title="Edit Host"
        subtitle="Update host information."
        backHref={`/hosts/${id}`}
      />

      <Alert type="error" message={error} />

      <Alert type="success" message={success} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        {/* Form */}
        <div className="xl:col-span-2">
          <Card>
            <HostFormFields formData={formData} onChange={handleChange} />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h2
              className="mb-4 text-xl font-bold"
              style={{
                color: COLORS.text,
              }}
            >
              Profile Image
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Profile Image */}
              <div
                className="flex flex-col items-center justify-center rounded-2xl p-4"
                style={{ backgroundColor: COLORS.softCard }}
              >
                <p className="mb-2 text-sm font-medium text-gray-600">
                  Profile Image
                </p>

                <div className="w-full aspect-square overflow-hidden rounded-xl">
                  <ImageUploader
                    value={formData.profileImage}
                    onChange={(url) =>
                      setFormData((prev) => ({
                        ...prev,
                        profileImage: url,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div
                className="flex flex-col items-center justify-center rounded-2xl p-4"
                style={{ backgroundColor: COLORS.softCard }}
              >
                <p className="mb-2 text-sm font-medium text-gray-600">
                  Cover Image
                </p>

                <div className="w-full aspect-video overflow-hidden rounded-xl">
                  <ImageUploader
                    value={formData.coverImage || ""}
                    onChange={(url) =>
                      setFormData((prev) => ({
                        ...prev,
                        coverImage: url,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              {formData.profileImage ? (
                <Image
                  src={formData.profileImage}
                  alt="Host"
                  width={120}
                  height={120}
                  className="rounded-full border object-cover"
                />
              ) : (
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: COLORS.softCard,
                  }}
                >
                  <User size={42} color={COLORS.primary} />
                </div>
              )}
            </div>

            {formData.fullName && (
              <div className="mt-4 text-center">
                <p
                  className="text-lg font-bold"
                  style={{
                    color: COLORS.text,
                  }}
                >
                  {formData.fullName}
                </p>

                <p
                  className="text-sm"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  {formData.city || "No City"}
                </p>

                <p
                  className="text-sm"
                  style={{
                    color: COLORS.muted,
                  }}
                >
                  {formData.email || "No Email"}
                </p>
              </div>
            )}
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
              Changes will be applied immediately to this host.
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
