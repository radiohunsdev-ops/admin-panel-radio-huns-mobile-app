"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, User } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { SubmitButton } from "@/common/SubmitButton";
import { SectionTitle } from "@/common/SectionTitle";
import { Alert } from "@/common/Alert";
import { Card } from "@/common/card";
import { PageHeader } from "@/common/PageHeader";

import { createUser } from "@/lib/userApi";
import UserFormFields, { INITIAL_USER_FORM, UserFormData } from "../../users/UserFromFields";
export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<UserFormData>(INITIAL_USER_FORM);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
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
      const response = await createUser(payload);
      setSuccess(response.message || "User created successfully");
      setFormData(INITIAL_USER_FORM);
      setTimeout(() => {
        router.push("/users");
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      {" "}
      {/* HEADER */}{" "}
      <PageHeader
        title="Add User"
        subtitle="Create a new platform user."
        backHref="/users"
      />{" "}
      {/* ALERTS */} <Alert type="error" message={error} />{" "}
      <Alert type="success" message={success} /> {/* FORM */}{" "}
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
          {/* PREVIEW */}{" "}
          <Card>
            {" "}
            <SectionTitle title="User Preview" />{" "}
            <div className="grid gap-4">
              {" "}
              <div
                className="flex items-center justify-center rounded-2xl px-4 py-6 text-center min-h-55"
                style={{ backgroundColor: COLORS.softCard }}
              >
                {" "}
                <div className="space-y-3">
                  {" "}
                  <div className="flex justify-center">
                    {" "}
                    <User size={48} color={COLORS.primary} />{" "}
                  </div>{" "}
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: COLORS.text }}
                  >
                    {" "}
                    {formData.fullName || "User Name"}{" "}
                  </h3>{" "}
                  <p className="text-sm" style={{ color: COLORS.muted }}>
                    {" "}
                    {formData.email || "user@example.com"}{" "}
                  </p>{" "}
                  <p
                    className="text-sm capitalize"
                    style={{ color: COLORS.muted }}
                  >
                    {" "}
                    {formData.role}{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </Card>{" "}
          {/* SUBMIT */}{" "}
          <Card>
            {" "}
            <h2
              className="mb-2 text-xl font-bold"
              style={{ color: COLORS.text }}
            >
              {" "}
              Ready to create?{" "}
            </h2>{" "}
            <SubmitButton
              loading={loading}
              label="Create User"
              loadingLabel="Creating..."
              icon={<Save size={20} />}
              fullWidth
            />{" "}
          </Card>{" "}
        </div>{" "}
      </form>{" "}
    </main>
  );
}
