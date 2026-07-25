"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHost } from "@/lib/hostApi";

import HostFormFields, {
  INITIAL_FORM,
  HostFormData,
  serializeForm,
} from "../HostFormFields";
import HostSidebar from "../HostSidebar";
import EntityFormLayout from "@/common/EntityFormLayout";
export default function CreateHostPage() {
  const router = useRouter();
  const [loading, setLoading] =useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<HostFormData>(INITIAL_FORM);
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
        await createHost(
          serializeForm(formData),
        );


      setSuccess(
        response.message ||
          "Host created successfully",
      );


      setFormData(
        INITIAL_FORM,
      );


      setTimeout(() => {
        router.push("/hosts");
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
      title="Add Host"
      subtitle="Create a new radio host."
      backHref="/hosts"
      error={error}
      success={success}
      loading={loading}
      submitLabel="Create Host"
      loadingLabel="Creating..."
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
          submitLabel="Create Host"
          loadingLabel="Creating..."
          buttonTitle="Ready to publish?"
        />
      }
    />
  );
}