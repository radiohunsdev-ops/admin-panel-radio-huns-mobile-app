"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";


import { createShow } from "@/lib/showApi";

import ShowFormFields, {
  INITIAL_FORM,
  ShowFormData,
} from "../ShowFormFields";
import { serializeShowForm } from "../showFormUtils";
import ShowSidebar from "../ShowSidebar";

export default function CreateShowPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] =
    useState<ShowFormData>(INITIAL_FORM);

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
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload =
        serializeShowForm(formData);

      const response =
        await createShow(payload);

      setSuccess(
        response.message ||
          "Show created successfully",
      );

      setFormData(INITIAL_FORM);

      setTimeout(() => {
        router.push("/shows");
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
      title="Add Show"
      subtitle="Create a new radio show."
      backHref="/shows"
      error={error}
      success={success}
      loading={loading}
      submitLabel="Create Show"
      loadingLabel="Creating..."
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