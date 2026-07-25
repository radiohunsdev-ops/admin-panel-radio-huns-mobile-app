"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";

import { createUser } from "@/lib/userApi";

import UserSidebar from "../UserSidebar";
import UserFormFields, {
  INITIAL_USER_FORM,
  UserFormData,
} from "../UserFromFields";

import { serializeUserForm } from "../userFormUtils";

export default function CreateUserPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] =
    useState<UserFormData>(
      INITIAL_USER_FORM
    );

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
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload =
        serializeUserForm(formData);

      const response =
        await createUser(payload);

      setSuccess(
        response.message ||
          "User created successfully"
      );

      setFormData(
        INITIAL_USER_FORM
      );

      setTimeout(() => {
        router.push("/users");
      }, 1200);
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

  return (
    <EntityFormLayout
      title="Add User"
      subtitle="Create a new platform user."
      backHref="/users"
      error={error}
      success={success}
      loading={loading}
      submitLabel="Create User"
      loadingLabel="Creating..."
      onSubmit={handleSubmit}
      form={
        <UserFormFields
          formData={formData}
          onChange={handleChange}
        />
      }
      sidebar={
        <UserSidebar
          formData={formData}
          setFormData={setFormData}
        />
      }
    />
  );
}