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

import { getUserById, updateUser } from "@/lib/userApi";
import UserFormFields, { INITIAL_USER_FORM, UserFormData } from "../../UserFromFields";
interface PageProps {
  params: Promise<{ id: string }>;
}
export default function EditUserPage({ params }: PageProps) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<UserFormData>(INITIAL_USER_FORM);
  useEffect(() => {
    async function loadUser() {
      try {
        const { id: userId } = await params;
        setId(userId);
        const user = await getUserById(userId);
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          password: "",
          role: user.role || "user",
          preferredLanguage: user.preferredLanguage || "",
          city: user.city || "",
          region: user.region || "",
          provider: user.provider || "email",
          emailVerified: String(user.emailVerified),
          showReminder15Min: String(
            user.notificationPreferences?.showReminder15Min ?? true,
          ),
          showReminder30Min: String(
            user.notificationPreferences?.showReminder30Min ?? false,
          ),
          giveawayAlerts: String(
            user.notificationPreferences?.giveawayAlerts ?? true,
          ),
          newsAlerts: String(user.notificationPreferences?.newsAlerts ?? true),
        });
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setPageLoading(false);
      }
    }
    loadUser();
  }, [params]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        preferredLanguage: formData.preferredLanguage || undefined,
        city: formData.city || undefined,
        region: formData.region || undefined,
        provider: formData.provider,
        emailVerified: formData.emailVerified === "true",
        notificationPreferences: {
          showReminder15Min: formData.showReminder15Min === "true",
          showReminder30Min: formData.showReminder30Min === "true",
          giveawayAlerts: formData.giveawayAlerts === "true",
          newsAlerts: formData.newsAlerts === "true",
        },
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }
      await updateUser(id, payload);
      setSuccess("User updated successfully");
      setTimeout(() => {
        router.push(`/users/${id}`);
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
      {" "}
      <PageHeader
        title="Edit User"
        subtitle="Update user information."
        backHref={`/users/${id}`}
      />{" "}
      <Alert type="error" message={error} />{" "}
      <Alert type="success" message={success} />{" "}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        {" "}
        {/* LEFT */}{" "}
        <div className="xl:col-span-2">
          {" "}
          <Card>
            {" "}
            <UserFormFields formData={formData} onChange={handleChange} />{" "}
          </Card>{" "}
        </div>{" "}
        {/* RIGHT */}{" "}
        <div className="space-y-6">
          {" "}
          <Card>
            {" "}
            <h2
              className="mb-2 text-xl font-bold"
              style={{ color: COLORS.text }}
            >
              {" "}
              Save Changes{" "}
            </h2>{" "}
            <p className="mb-4 text-sm" style={{ color: COLORS.muted }}>
              {" "}
              Updates will reflect immediately for this user.{" "}
            </p>{" "}
            <SubmitButton
              loading={loading}
              label="Save Changes"
              loadingLabel="Saving..."
              icon={<Save size={18} />}
              fullWidth
            />{" "}
          </Card>{" "}
        </div>{" "}
      </form>{" "}
    </main>
  );
}
