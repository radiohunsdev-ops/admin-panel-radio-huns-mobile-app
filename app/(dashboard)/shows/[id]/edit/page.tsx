"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";

import ShowSidebar from "../../ShowSidebar";

import ShowFormFields, {INITIAL_FORM,ShowFormData} from "../../ShowFormFields";

import {getShowById, updateShow} from "@/lib/showApi";

import {mapShowToForm, serializeShowForm } from "../../showFormUtils";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditShowPage({
  params,
}: PageProps) {
  const router = useRouter();

  const [id, setId] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [formData, setFormData] =
    useState<ShowFormData>(
      INITIAL_FORM,
    );

  useEffect(() => {
    async function loadShow() {
      try {
        const { id: showId } =
          await params;

        setId(showId);

        const show =
          await getShowById(
            showId,
          );

        setFormData(
          mapShowToForm(show),
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load show",
        );
      } finally {
        setPageLoading(false);
      }
    }

    loadShow();
  }, [params]);

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >,
  ) => {
    const { name, value } =
      e.target;

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
        serializeShowForm(
          formData,
        );

      const response =
        await updateShow(
          id,
          payload,
        );

      setSuccess(
        response.message ||
          "Show updated successfully",
      );

      setTimeout(() => {
        router.push(
          `/shows/${id}`,
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

  return (
    <EntityFormLayout
      pageLoading={pageLoading}
      title="Edit Show"
      subtitle="Update show information."
      backHref={`/shows/${id}`}
      error={error}
      success={success}
      loading={loading}
      submitLabel="Save Changes"
      loadingLabel="Saving..."
      onSubmit={handleSubmit}
      form={
        <ShowFormFields
          formData={formData}
          onChange={handleChange}
        />
      }
      sidebar={
        <ShowSidebar
          formData={formData}
          setFormData={setFormData}
        />
      }
    />
  );
}