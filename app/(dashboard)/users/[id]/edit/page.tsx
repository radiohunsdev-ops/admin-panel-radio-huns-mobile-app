"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import EntityFormLayout from "@/common/EntityFormLayout";

import { getUserById, updateUser } from "@/lib/userApi";

import UserSidebar from "../../UserSidebar";

import UserFormFields, {
  INITIAL_USER_FORM,
  UserFormData,
} from "../../UserFromFields";

import {
  mapUserToForm,
  serializeUserForm,
} from "../../userFormUtils";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditUserPage({
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
    useState<UserFormData>(
      INITIAL_USER_FORM,
    );

  useEffect(() => {
    async function loadUser() {
      try {
        const { id: userId } =
          await params;

        setId(userId);

        const user =
          await getUserById(
            userId,
          );

        setFormData(
          mapUserToForm(user),
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load user",
        );
      } finally {
        setPageLoading(false);
      }
    }

    loadUser();
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
        serializeUserForm(
          formData,
        );

      const response =
        await updateUser(
          id,
          payload,
        );

      setSuccess(
        response.message ||
          "User updated successfully",
      );

      setTimeout(() => {
        router.push(
          `/users/${id}`,
        );
      }, 1200);
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
      pageLoading={
        pageLoading
      }
      title="Edit User"
      subtitle="Update user information."
      backHref={`/users/${id}`}
      error={error}
      success={success}
      loading={loading}
      submitLabel="Save Changes"
      loadingLabel="Saving..."
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