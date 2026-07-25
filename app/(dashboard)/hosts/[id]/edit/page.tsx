"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getHostById, updateHost } from "@/lib/hostApi";
import { PageLoader } from "@/common/PageLoader";
import HostFormFields, {
  INITIAL_FORM,
  HostFormData,
  serializeForm,
} from "../../HostFormFields";
import HostSidebar from "../../HostSidebar";
import { mapHostToForm } from "../../hostFormUtils";
import EntityFormLayout from "@/common/EntityFormLayout";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditHostPage({
  params,
}: PageProps) {
  const router = useRouter();
  const [id, setId] =
    useState("");
  const [pageLoading, setPageLoading] =
    useState(true);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [success, setSuccess] =
    useState("");
  const [formData, setFormData] =
    useState<HostFormData>(
      INITIAL_FORM,
    );
  useEffect(() => {
    async function loadHost() {
      try {
        const {
          id: hostId,
        } = await params;
        setId(hostId);
        const host =
          await getHostById(
            hostId,
          );
        setFormData(
          mapHostToForm(host),
        );
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load host",
        );
      } finally {
        setPageLoading(false);
      }
    }
    loadHost();
  }, [params]);





  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const {
      name,
      value,
    } = e.target;
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
      const response =
        await updateHost(
          id,
          serializeForm(formData),
        );
      setSuccess(
        response.message ||
          "Host updated successfully",
      );
      setTimeout(() => {
        router.push(
          `/hosts/${id}`,
        );
      }, 1500);
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
  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <EntityFormLayout
      title="Edit Host"
      subtitle="Update host information."
      backHref={`/hosts/${id}`}
      error={error}
      success={success}
      loading={loading}
      submitLabel="Save Changes"
      loadingLabel="Saving..."
      onSubmit={handleSubmit}
      form={
        <HostFormFields
          formData={formData}
          onChange={handleChange}
        />
      }
      sidebar={
        <HostSidebar
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          submitLabel="Save Changes"
          loadingLabel="Saving..."
          buttonTitle="Save Changes"
          description="Changes will be applied immediately to this host."
        />
      }
    />
  );
}