"use client";

import React from "react";
import { User, Bell } from "lucide-react";

import { COLORS } from "@/constants/colors";
import { SectionTitle } from "@/common/SectionTitle";
import { FormField } from "@/common/FormField";

/* =========================
   TYPES
========================= */
export interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;

  role: "admin" | "manager" | "user";

  preferredLanguage:
    | "Hindi"
    | "Punjabi"
    | "Urdu"
    | "English"
    | "";

  city: string;
  region: string;

  provider:
    | "email"
    | "google"
    | "apple"
    | "phone";

  emailVerified: string;

  showReminder15Min: string;
  showReminder30Min: string;
  giveawayAlerts: string;
  newsAlerts: string;
}

/* =========================
   INITIAL FORM
========================= */
export const INITIAL_USER_FORM: UserFormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",

  role: "user",

  preferredLanguage: "",

  city: "",
  region: "",

  provider: "email",

  emailVerified: "false",

  showReminder15Min: "true",
  showReminder30Min: "false",
  giveawayAlerts: "true",
  newsAlerts: "true",
};

/* =========================
   OPTIONS
========================= */
const BOOLEAN_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const ROLE_OPTIONS = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "user",
    label: "User",
  },
];

const LANGUAGE_OPTIONS = [
  {
    value: "",
    label: "Select Language",
  },
  {
    value: "Hindi",
    label: "Hindi",
  },
  {
    value: "Punjabi",
    label: "Punjabi",
  },
  {
    value: "Urdu",
    label: "Urdu",
  },
  {
    value: "English",
    label: "English",
  },
];

const PROVIDER_OPTIONS = [
  {
    value: "email",
    label: "Email",
  },
  {
    value: "google",
    label: "Google",
  },
  {
    value: "apple",
    label: "Apple",
  },
  {
    value: "phone",
    label: "Phone",
  },
];

type ChangeHandler = (
  e: React.ChangeEvent<
    HTMLInputElement |
    HTMLTextAreaElement |
    HTMLSelectElement
  >
) => void;

/* =========================
   PROPS
========================= */
interface UserFormFieldsProps {
  formData: UserFormData;
  onChange: ChangeHandler;
}

export default function UserFormFields({
  formData,
  onChange,
}: UserFormFieldsProps) {
  return (
    <div className="space-y-8">
      {/* =========================
          BASIC INFO
      ========================= */}
      <section>
        <SectionTitle
          title="User Information"
          subtitle="Basic user details."
          icon={
            <User
              size={20}
              color={COLORS.primary}
            />
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            required
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            required
          />

          <FormField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
          />

          <FormField
            as="select"
            label="Role"
            name="role"
            value={formData.role}
            onChange={onChange}
            options={ROLE_OPTIONS}
          />

          <FormField
            as="select"
            label="Preferred Language"
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={onChange}
            options={LANGUAGE_OPTIONS}
          />

          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={onChange}
          />

          <FormField
            label="Region"
            name="region"
            value={formData.region}
            onChange={onChange}
          />

          <FormField
            as="select"
            label="Provider"
            name="provider"
            value={formData.provider}
            onChange={onChange}
            options={PROVIDER_OPTIONS}
          />

          <FormField
            as="select"
            label="Email Verified"
            name="emailVerified"
            value={formData.emailVerified}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />
        </div>
      </section>

      {/* =========================
          NOTIFICATIONS
      ========================= */}
      <section>
        <SectionTitle
          title="Notification Preferences"
          subtitle="Configure user alerts."
          icon={
            <Bell
              size={20}
              color={COLORS.primary}
            />
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            as="select"
            label="15 Min Reminder"
            name="showReminder15Min"
            value={formData.showReminder15Min}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="30 Min Reminder"
            name="showReminder30Min"
            value={formData.showReminder30Min}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="Giveaway Alerts"
            name="giveawayAlerts"
            value={formData.giveawayAlerts}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />

          <FormField
            as="select"
            label="News Alerts"
            name="newsAlerts"
            value={formData.newsAlerts}
            onChange={onChange}
            options={BOOLEAN_OPTIONS}
          />
        </div>
      </section>
    </div>
  );
}