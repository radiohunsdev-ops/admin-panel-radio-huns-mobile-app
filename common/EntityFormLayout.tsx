"use client";

import { ReactNode } from "react";
import { Save } from "lucide-react";

import { Alert } from "@/common/Alert";
import { Card } from "@/common/card";
import { PageHeader } from "@/common/PageHeader";
import { SubmitButton } from "@/common/SubmitButton";
import { PageLoader } from "@/common/PageLoader";

interface EntityFormLayoutProps {
  title: string;
  subtitle: string;
  backHref: string;

  error?: string;
  success?: string;

  loading?: boolean;
  pageLoading?: boolean;

  submitLabel: string;
  loadingLabel: string;

  form: ReactNode;
  sidebar: ReactNode;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function EntityFormLayout({
  title,
  subtitle,
  backHref,
  error,
  success,
  loading,
  pageLoading,
  submitLabel,
  loadingLabel,
  form,
  sidebar,
  onSubmit,
}: EntityFormLayoutProps) {
  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <PageHeader
        title={title}
        subtitle={subtitle}
        backHref={backHref}
      />

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        <div className="xl:col-span-2">
          <Card>{form}</Card>
        </div>

        <div className="space-y-6">
          {sidebar}

          <Card>
            <SubmitButton
              loading={loading ?? false}
              label={submitLabel}
              loadingLabel={loadingLabel}
              icon={<Save size={18} />}
              fullWidth
            />
          </Card>
        </div>
      </form>
    </main>
  );
}